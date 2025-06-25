import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Get unread notification count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => 
        q.eq("userId", userId).eq("isRead", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

// Get notifications for the current user
export const getUserNotifications = query({
  args: { 
    limit: v.optional(v.number()),
    onlyUnread: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit ?? 20;
    
    let query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.onlyUnread) {
      query = ctx.db
        .query("notifications")
        .withIndex("by_user_and_read", (q) => 
          q.eq("userId", userId).eq("isRead", false)
        );
    }

    const notifications = await query
      .order("desc")
      .take(limit);

    // Enrich notifications with related data
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const [triggeredByUser, post, comment, community] = await Promise.all([
          ctx.db.get(notification.triggeredByUserId),
          notification.postId ? ctx.db.get(notification.postId) : null,
          notification.commentId ? ctx.db.get(notification.commentId) : null,
          notification.communityId ? ctx.db.get(notification.communityId) : null,
        ]);

        return {
          ...notification,
          triggeredByUser: triggeredByUser ? {
            name: triggeredByUser.name,
            email: triggeredByUser.email
          } : null,
          post: post ? {
            title: post.title,
            communityId: post.communityId
          } : null,
          comment: comment ? {
            content: comment.content.substring(0, 100) + (comment.content.length > 100 ? "..." : ""),
            postId: comment.postId
          } : null,
          community: community ? {
            name: community.name,
            slug: community.slug
          } : null,
        };
      })
    );

    return enrichedNotifications;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => 
        q.eq("userId", userId).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unreadNotifications.map(notification =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );
  },
});

// Internal function to create notifications
export const createNotification = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("new_post"),
      v.literal("post_vote"),
      v.literal("post_comment"),
      v.literal("comment_vote"),
      v.literal("comment_reply")
    ),
    title: v.string(),
    message: v.string(),
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    communityId: v.optional(v.id("communities")),
    triggeredByUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Don't create notification if user is triggering action on their own content
    if (args.userId === args.triggeredByUserId) {
      return;
    }

    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      isRead: false,
      postId: args.postId,
      commentId: args.commentId,
      communityId: args.communityId,
      triggeredByUserId: args.triggeredByUserId,
    });
  },
});

// Internal function to notify community members of new posts
export const notifyNewPost = internalMutation({
  args: {
    postId: v.id("posts"),
    communityId: v.id("communities"),
    authorId: v.id("users"),
    postTitle: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all community members except the author
    const members = await ctx.db
      .query("communityMembers")
      .withIndex("by_community", (q) => q.eq("communityId", args.communityId))
      .collect();

    const [community, author] = await Promise.all([
      ctx.db.get(args.communityId),
      ctx.db.get(args.authorId),
    ]);

    if (!community || !author) return;

    // Create notifications for all members except the author
    const notifications = members
      .filter(member => member.userId !== args.authorId)
      .map(member => ({
        userId: member.userId,
        type: "new_post" as const,
        title: `New post in r/${community.name}`,
        message: `${author.name || "Someone"} posted: ${args.postTitle}`,
        isRead: false,
        postId: args.postId,
        communityId: args.communityId,
        triggeredByUserId: args.authorId,
      }));

    // Batch insert notifications
    await Promise.all(
      notifications.map(notification => ctx.db.insert("notifications", notification))
    );
  },
});