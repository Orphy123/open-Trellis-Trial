import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("communities")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .take(limit);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getUserCommunities = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("communityMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const communities = await Promise.all(
      memberships.map(async (membership) => {
        const community = await ctx.db.get(membership.communityId);
        return community ? { ...community, role: membership.role } : null;
      })
    );

    return communities.filter((c): c is NonNullable<typeof c> => c !== null);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to create a community");

    // Check if slug already exists
    const existing = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error("Community with this name already exists");
    }

    const communityId = await ctx.db.insert("communities", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      creatorId: userId,
      memberCount: 1,
      isPublic: true,
    });

    // Add creator as member
    await ctx.db.insert("communityMembers", {
      communityId,
      userId,
      role: "creator",
    });

    return communityId;
  },
});

export const join = mutation({
  args: { communityId: v.id("communities") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to join a community");

    // Check if already a member
    const existing = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_and_user", (q) =>
        q.eq("communityId", args.communityId).eq("userId", userId)
      )
      .unique();

    if (existing) {
      throw new Error("Already a member of this community");
    }

    await ctx.db.insert("communityMembers", {
      communityId: args.communityId,
      userId,
      role: "member",
    });

    // Update member count
    const community = await ctx.db.get(args.communityId);
    if (community) {
      await ctx.db.patch(args.communityId, {
        memberCount: community.memberCount + 1,
      });
    }
  },
});

export const leave = mutation({
  args: { communityId: v.id("communities") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_and_user", (q) =>
        q.eq("communityId", args.communityId).eq("userId", userId)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this community");
    }

    if (membership.role === "creator") {
      throw new Error("Creator cannot leave their own community");
    }

    await ctx.db.delete(membership._id);

    // Update member count
    const community = await ctx.db.get(args.communityId);
    if (community) {
      await ctx.db.patch(args.communityId, {
        memberCount: Math.max(0, community.memberCount - 1),
      });
    }
  },
});

export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("communities")
      .withSearchIndex("search_communities", (q) =>
        q.search("name", args.query).eq("isPublic", true)
      )
      .take(limit);
  },
});
