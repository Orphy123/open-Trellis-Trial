import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const listByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Enrich with author data
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    // Sort by creation time (newest first for top-level, then by votes)
    return enrichedComments.sort((a, b) => {
      if (a.depth === 0 && b.depth === 0) {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      }
      return a._creationTime - b._creationTime;
    });
  },
});

export const create = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts"),
    parentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to comment");

    let depth = 0;
    if (args.parentId) {
      const parentComment = await ctx.db.get(args.parentId);
      if (!parentComment) throw new Error("Parent comment not found");
      depth = parentComment.depth + 1;
    }

    const commentId = await ctx.db.insert("comments", {
      content: args.content,
      postId: args.postId,
      authorId: userId,
      parentId: args.parentId,
      upvotes: 1,
      downvotes: 0,
      depth,
    });

    // Update post comment count
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        commentCount: post.commentCount + 1,
      });

      // Create notification for post author (if commenting on post)
      if (!args.parentId) {
        const commenter = await ctx.db.get(userId);
        await ctx.scheduler.runAfter(0, internal.notifications.createNotification, {
          userId: post.authorId,
          type: "post_comment",
          title: "New comment on your post!",
          message: `${commenter?.name || "Someone"} commented on your post: ${post.title}`,
          postId: args.postId,
          commentId,
          triggeredByUserId: userId,
        });
      } else {
        // Create notification for parent comment author (if replying to comment)
        const parentComment = await ctx.db.get(args.parentId);
        if (parentComment) {
          const commenter = await ctx.db.get(userId);
          await ctx.scheduler.runAfter(0, internal.notifications.createNotification, {
            userId: parentComment.authorId,
            type: "comment_reply",
            title: "Someone replied to your comment!",
            message: `${commenter?.name || "Someone"} replied to your comment`,
            postId: args.postId,
            commentId,
            triggeredByUserId: userId,
          });
        }
      }
    }

    return commentId;
  },
});

export const vote = mutation({
  args: {
    commentId: v.id("comments"),
    voteType: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to vote");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    // Check existing vote
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", userId).eq("targetId", args.commentId)
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
        targetId: args.commentId,
        targetType: "comment",
        voteType: args.voteType,
      });
      if (args.voteType === "up") {
        upvoteDelta = 1;
        shouldNotify = true;
      } else {
        downvoteDelta = 1;
      }
    }

    // Update comment vote counts
    await ctx.db.patch(args.commentId, {
      upvotes: comment.upvotes + upvoteDelta,
      downvotes: comment.downvotes + downvoteDelta,
    });

    // Create notification for comment author if it's an upvote
    if (shouldNotify && args.voteType === "up") {
      const voter = await ctx.db.get(userId);
      await ctx.scheduler.runAfter(0, internal.notifications.createNotification, {
        userId: comment.authorId,
        type: "comment_vote",
        title: "Your comment received an upvote!",
        message: `${voter?.name || "Someone"} upvoted your comment`,
        commentId: args.commentId,
        postId: comment.postId,
        triggeredByUserId: userId,
      });
    }
  },
});

export const getUserVote = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", userId).eq("targetId", args.commentId)
      )
      .unique();

    return vote?.voteType ?? null;
  },
});