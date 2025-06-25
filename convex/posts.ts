import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

function calculateHotScore(upvotes: number, downvotes: number, creationTime: number): number {
  const score = upvotes - downvotes;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = (creationTime - 1134028003000) / 1000; // Epoch adjusted
  return sign * order + seconds / 45000;
}

export const list = query({
  args: {
    communityId: v.optional(v.id("communities")),
    sortBy: v.optional(v.union(v.literal("hot"), v.literal("new"), v.literal("top"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const sortBy = args.sortBy ?? "hot";

    let posts;
    if (args.communityId) {
      const communityId = args.communityId;
      const query = ctx.db
        .query("posts")
        .withIndex("by_community_and_hot", (q) =>
          q.eq("communityId", communityId)
        );
      
      if (sortBy === "new") {
        posts = await query.order("desc").take(limit);
      } else if (sortBy === "top") {
        posts = await query.collect();
        posts = posts
          .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
          .slice(0, limit);
      } else {
        posts = await query.order("desc").take(limit);
      }
    } else {
      const query = ctx.db.query("posts").withIndex("by_hot_score");
      
      if (sortBy === "new") {
        posts = await query.order("desc").take(limit);
      } else if (sortBy === "top") {
        posts = await query.collect();
        posts = posts
          .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
          .slice(0, limit);
      } else {
        posts = await query.order("desc").take(limit);
      }
    }

    // Get additional data for each post
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const [author, community] = await Promise.all([
          ctx.db.get(post.authorId),
          ctx.db.get(post.communityId),
        ]);

        return {
          ...post,
          author: author ? { name: author.name, email: author.email } : null,
          community: community ? { name: community.name, slug: community.slug } : null,
        };
      })
    );

    return enrichedPosts;
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;

    const [author, community] = await Promise.all([
      ctx.db.get(post.authorId),
      ctx.db.get(post.communityId),
    ]);

    return {
      ...post,
      author: author ? { name: author.name, email: author.email } : null,
      community: community ? { name: community.name, slug: community.slug } : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.optional(v.string()),
    type: v.union(v.literal("text"), v.literal("link"), v.literal("image")),
    url: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    communityId: v.id("communities"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to create a post");

    // Check if user is a member of the community
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_and_user", (q) =>
        q.eq("communityId", args.communityId).eq("userId", userId)
      )
      .unique();

    if (!membership) {
      throw new Error("Must be a member of the community to post");
    }

    const now = Date.now();
    const hotScore = calculateHotScore(1, 0, now);

    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      type: args.type,
      url: args.url,
      imageId: args.imageId,
      communityId: args.communityId,
      authorId: userId,
      upvotes: 1,
      downvotes: 0,
      commentCount: 0,
      hotScore,
    });

    // Schedule notification creation for community members
    await ctx.scheduler.runAfter(0, internal.notifications.notifyNewPost, {
      postId,
      communityId: args.communityId,
      authorId: userId,
      postTitle: args.title,
    });

    return postId;
  },
});

export const vote = mutation({
  args: {
    postId: v.id("posts"),
    voteType: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to vote");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Check existing vote
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", userId).eq("targetId", args.postId)
      )
      .unique();

    let upvoteDelta = 0;
    let downvoteDelta = 0;
    let shouldNotify = false;

    if (existingVote) {
      if (existingVote.voteType === args.voteType) {
        // Remove vote
        await ctx.db.delete(existingVote._id);
        if (args.voteType === "up") upvoteDelta = -1;
        else downvoteDelta = -1;
      } else {
        // Change vote
        await ctx.db.patch(existingVote._id, { voteType: args.voteType });
        if (args.voteType === "up") {
          upvoteDelta = 1;
          downvoteDelta = -1;
          shouldNotify = true;
        } else {
          upvoteDelta = -1;
          downvoteDelta = 1;
        }
      }
    } else {
      // New vote
      await ctx.db.insert("votes", {
        userId,
        targetId: args.postId,
        targetType: "post",
        voteType: args.voteType,
      });
      if (args.voteType === "up") {
        upvoteDelta = 1;
        shouldNotify = true;
      } else {
        downvoteDelta = 1;
      }
    }

    // Update post vote counts
    const newUpvotes = post.upvotes + upvoteDelta;
    const newDownvotes = post.downvotes + downvoteDelta;
    const newHotScore = calculateHotScore(newUpvotes, newDownvotes, post._creationTime);

    await ctx.db.patch(args.postId, {
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      hotScore: newHotScore,
    });

    // Create notification for post author if it's an upvote
    if (shouldNotify && args.voteType === "up") {
      const voter = await ctx.db.get(userId);
      await ctx.scheduler.runAfter(0, internal.notifications.createNotification, {
        userId: post.authorId,
        type: "post_vote",
        title: "Your post received an upvote!",
        message: `${voter?.name || "Someone"} upvoted your post: ${post.title}`,
        postId: args.postId,
        triggeredByUserId: userId,
      });
    }
  },
});

export const getUserVote = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", userId).eq("targetId", args.postId)
      )
      .unique();

    return vote?.voteType ?? null;
  },
});

export const search = query({
  args: {
    query: v.string(),
    communityId: v.optional(v.id("communities")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    const posts = await ctx.db
      .query("posts")
      .withSearchIndex("search_posts", (q) => {
        let searchQuery = q.search("title", args.query);
        if (args.communityId) {
          searchQuery = searchQuery.eq("communityId", args.communityId);
        }
        return searchQuery;
      })
      .take(limit);

    // Enrich with author and community data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const [author, community] = await Promise.all([
          ctx.db.get(post.authorId),
          ctx.db.get(post.communityId),
        ]);

        return {
          ...post,
          author: author ? { name: author.name, email: author.email } : null,
          community: community ? { name: community.name, slug: community.slug } : null,
        };
      })
    );

    return enrichedPosts;
  },
});