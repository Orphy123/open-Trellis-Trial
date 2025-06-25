import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  communities: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    banner: v.optional(v.string()),
    creatorId: v.id("users"),
    memberCount: v.number(),
    isPublic: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_creator", ["creatorId"])
    .searchIndex("search_communities", {
      searchField: "name",
      filterFields: ["isPublic"],
    }),

  communityMembers: defineTable({
    communityId: v.id("communities"),
    userId: v.id("users"),
    role: v.union(v.literal("member"), v.literal("moderator"), v.literal("creator")),
  })
    .index("by_community", ["communityId"])
    .index("by_user", ["userId"])
    .index("by_community_and_user", ["communityId", "userId"]),

  posts: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    type: v.union(v.literal("text"), v.literal("link"), v.literal("image")),
    url: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    communityId: v.id("communities"),
    authorId: v.id("users"),
    upvotes: v.number(),
    downvotes: v.number(),
    commentCount: v.number(),
    hotScore: v.number(),
  })
    .index("by_community", ["communityId"])
    .index("by_author", ["authorId"])
    .index("by_hot_score", ["hotScore"])
    .index("by_community_and_hot", ["communityId", "hotScore"])
    .searchIndex("search_posts", {
      searchField: "title",
      filterFields: ["communityId", "type"],
    }),

  comments: defineTable({
    content: v.string(),
    postId: v.id("posts"),
    authorId: v.id("users"),
    parentId: v.optional(v.id("comments")),
    upvotes: v.number(),
    downvotes: v.number(),
    depth: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentId"])
    .index("by_post_and_parent", ["postId", "parentId"]),

  votes: defineTable({
    userId: v.id("users"),
    targetId: v.string(), // Can be post or comment ID
    targetType: v.union(v.literal("post"), v.literal("comment")),
    voteType: v.union(v.literal("up"), v.literal("down")),
  })
    .index("by_user_and_target", ["userId", "targetId"])
    .index("by_target", ["targetId"]),

  notifications: defineTable({
    userId: v.id("users"), // User who receives the notification
    type: v.union(
      v.literal("new_post"), // New post in followed community
      v.literal("post_vote"), // Someone voted on user's post
      v.literal("post_comment"), // Someone commented on user's post
      v.literal("comment_vote"), // Someone voted on user's comment
      v.literal("comment_reply") // Someone replied to user's comment
    ),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    // Related entities
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    communityId: v.optional(v.id("communities")),
    triggeredByUserId: v.id("users"), // User who triggered the notification
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "isRead"])
    .index("by_post", ["postId"])
    .index("by_comment", ["commentId"]),
};

// Extend the auth users table to include profile picture
const extendedAuthTables = {
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    profilePicture: v.optional(v.id("_storage")),
  }).index("email", ["email"]),
};

export default defineSchema({
  ...extendedAuthTables,
  ...applicationTables,
});