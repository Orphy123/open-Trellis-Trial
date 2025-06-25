import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Export notification functions
export * from "./notifications";

// Export seed data functions
export * from "./seedData";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to upload files");
    
    return await ctx.storage.generateUploadUrl();
  },
});