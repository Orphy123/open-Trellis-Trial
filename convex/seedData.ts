import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Dummy data for seeding
const dummyCommunities = [
  {
    name: "Startup Founders",
    slug: "startup-founders",
    description: "A community for entrepreneurs building the next big thing. Share your journey, ask for advice, and connect with fellow founders.",
  },
  {
    name: "Tech News & Discussion",
    slug: "tech-news",
    description: "Latest technology news, product launches, and industry discussions. Stay updated with the fast-paced world of tech.",
  },
  {
    name: "Web Development",
    slug: "webdev",
    description: "Frontend, backend, full-stack development discussions. Share code, ask questions, and learn from the community.",
  },
  {
    name: "Product Design",
    slug: "product-design",
    description: "UI/UX design, user research, and product strategy. Discuss design principles and share your work.",
  },
  {
    name: "Remote Work",
    slug: "remote-work",
    description: "Tips, tools, and discussions about working remotely. Productivity, work-life balance, and remote team management.",
  },
  {
    name: "AI & Machine Learning",
    slug: "ai-ml",
    description: "Artificial intelligence, machine learning, and data science. Share research, projects, and industry insights.",
  },
  {
    name: "Freelancing",
    slug: "freelancing",
    description: "Freelance tips, client management, and business advice. Connect with other freelancers and share experiences.",
  },
  {
    name: "Indie Hackers",
    slug: "indie-hackers",
    description: "Building and launching side projects. Share your progress, get feedback, and celebrate wins with fellow builders.",
  },
];

const dummyUsers = [
  { name: "Alex Chen", email: "alex@example.com" },
  { name: "Sarah Johnson", email: "sarah@example.com" },
  { name: "Mike Rodriguez", email: "mike@example.com" },
  { name: "Emily Davis", email: "emily@example.com" },
  { name: "David Kim", email: "david@example.com" },
  { name: "Lisa Wang", email: "lisa@example.com" },
  { name: "James Wilson", email: "james@example.com" },
  { name: "Maria Garcia", email: "maria@example.com" },
  { name: "Tom Anderson", email: "tom@example.com" },
  { name: "Rachel Green", email: "rachel@example.com" },
];

const dummyPosts = [
  // Startup Founders
  {
    title: "Just launched my SaaS after 6 months of building - AMA!",
    content: "Hey everyone! I'm excited to share that I've finally launched my SaaS product after 6 months of development. It's a project management tool specifically designed for remote teams.\n\n**Key features:**\n- Real-time collaboration\n- Time tracking\n- Automated reporting\n- Integration with popular tools\n\nI'd love to answer any questions about the development process, tech stack, or launch strategy. What would you like to know?",
    type: "text" as const,
    communitySlug: "startup-founders",
  },
  {
    title: "How I got my first 100 customers without spending on marketing",
    content: "I wanted to share my journey of getting the first 100 customers for my startup. Here's what worked for me:\n\n1. **Product Hunt launch** - Got 50 signups in the first day\n2. **Reddit communities** - Posted in relevant subreddits\n3. **LinkedIn content** - Shared my journey regularly\n4. **Cold outreach** - Reached out to 200 potential customers\n5. **Referral program** - Offered incentives for referrals\n\nTotal cost: $0 in marketing spend. Time investment: 3 months of consistent effort.",
    type: "text" as const,
    communitySlug: "startup-founders",
  },
  {
    title: "The biggest mistake I made as a first-time founder",
    content: "Looking back at my first startup, I made so many mistakes. But the biggest one was trying to build everything myself instead of focusing on what I was good at.\n\nI spent months learning design, marketing, and sales when I should have been focused on product development and finding product-market fit.\n\n**Lesson learned:** Delegate or outsource tasks that aren't your core strengths. Your time is better spent on activities that directly impact your product and customers.",
    type: "text" as const,
    communitySlug: "startup-founders",
  },

  // Tech News
  {
    title: "OpenAI releases GPT-5 with significant improvements",
    content: "OpenAI has just announced GPT-5, their latest language model with major improvements in reasoning, coding, and creative writing capabilities.\n\n**Key improvements:**\n- 40% better reasoning on complex problems\n- Enhanced code generation with better debugging\n- Improved context window (up to 1M tokens)\n- Better multilingual support\n\nWhat are your thoughts on this release? How do you think it will impact the AI landscape?",
    type: "text" as const,
    communitySlug: "tech-news",
  },
  {
    title: "Apple's new AR headset: First impressions and potential use cases",
    content: "I got to try Apple's new AR headset at their developer conference. Here are my thoughts:\n\n**Pros:**\n- Incredible display quality\n- Seamless integration with Apple ecosystem\n- Comfortable for extended use\n- Great hand tracking\n\n**Cons:**\n- Expensive ($3,500)\n- Limited app ecosystem\n- Battery life could be better\n\nI think this could revolutionize how we work and consume content, but it needs more killer apps to justify the price.",
    type: "text" as const,
    communitySlug: "tech-news",
  },
  {
    title: "The future of remote work: Hybrid models that actually work",
    content: "After 3 years of remote work, I've seen what works and what doesn't. Here's my take on the future:\n\n**Hybrid models that work:**\n- 2-3 days in office for collaboration\n- Remote days for deep work\n- Quarterly in-person team retreats\n- Flexible hours based on time zones\n\n**What doesn't work:**\n- Mandatory office days without purpose\n- Same schedule for everyone\n- No clear communication guidelines\n\nWhat's your company's approach to hybrid work?",
    type: "text" as const,
    communitySlug: "remote-work",
  },

  // Web Development
  {
    title: "React 19: What's new and should you upgrade?",
    content: "React 19 is finally here! Here are the key new features:\n\n**New Features:**\n- Automatic batching for all updates\n- Improved Suspense for data fetching\n- Better error boundaries\n- New use() hook for data\n- Improved concurrent features\n\n**Should you upgrade?**\n- If you're starting a new project: Yes\n- If you have a stable app: Wait for ecosystem updates\n- If you're using experimental features: Test thoroughly\n\nI've been testing it for a week and the performance improvements are noticeable!",
    type: "text" as const,
    communitySlug: "webdev",
  },
  {
    title: "My journey from junior to senior developer in 3 years",
    content: "I wanted to share my experience of growing from a junior to senior developer. Here's what helped me the most:\n\n**Technical growth:**\n- Built side projects to learn new technologies\n- Contributed to open source\n- Read code from experienced developers\n- Practiced system design problems\n\n**Soft skills:**\n- Learned to mentor junior developers\n- Improved communication with non-technical stakeholders\n- Became comfortable with code reviews\n- Started leading small projects\n\n**Key lesson:** Focus on both technical depth and leadership skills.",
    type: "text" as const,
    communitySlug: "webdev",
  },

  // Product Design
  {
    title: "Design system case study: How we improved our design consistency by 80%",
    content: "I led the creation of a design system for our 50-person product team. Here's what we learned:\n\n**Process:**\n1. Audited existing components\n2. Created a component library\n3. Established design tokens\n4. Built documentation\n5. Trained the team\n\n**Results:**\n- 80% reduction in design inconsistencies\n- 60% faster design handoffs\n- 40% fewer design bugs\n- Improved developer-designer collaboration\n\n**Key success factors:**\n- Executive buy-in\n- Comprehensive documentation\n- Regular team training\n- Continuous improvement process",
    type: "text" as const,
    communitySlug: "product-design",
  },
  {
    title: "The psychology behind effective user onboarding",
    content: "I've analyzed 100+ onboarding flows and here are the psychological principles that make them effective:\n\n**Cognitive load reduction:**\n- Progressive disclosure\n- Clear visual hierarchy\n- Minimal distractions\n\n**Social proof:**\n- User testimonials\n- Usage statistics\n- Community highlights\n\n**Immediate value:**\n- Quick wins in first 5 minutes\n- Clear value proposition\n- Guided setup process\n\n**Gamification:**\n- Progress indicators\n- Achievement badges\n- Completion celebrations\n\nWhat onboarding flows have impressed you recently?",
    type: "text" as const,
    communitySlug: "product-design",
  },

  // AI & ML
  {
    title: "Building a recommendation system from scratch",
    content: "I recently built a recommendation system for an e-commerce platform. Here's my approach:\n\n**Data collection:**\n- User behavior tracking\n- Purchase history\n- Product interactions\n- Search queries\n\n**Algorithm:**\n- Collaborative filtering\n- Content-based filtering\n- Hybrid approach\n\n**Implementation:**\n- Python with scikit-learn\n- Redis for caching\n- Real-time updates\n\n**Results:**\n- 25% increase in conversion rate\n- 40% improvement in user engagement\n- 15% boost in average order value\n\nWould love to discuss the technical details with anyone interested!",
    type: "text" as const,
    communitySlug: "ai-ml",
  },
  {
    title: "The ethical implications of AI in hiring",
    content: "As AI becomes more prevalent in hiring, we need to discuss the ethical implications:\n\n**Potential benefits:**\n- Reduced bias in screening\n- Faster hiring process\n- Better candidate matching\n- Cost savings\n\n**Concerns:**\n- Algorithmic bias\n- Lack of transparency\n- Privacy issues\n- Dehumanization of process\n\n**My take:** AI should augment human decision-making, not replace it. We need:\n- Transparent algorithms\n- Regular bias audits\n- Human oversight\n- Clear guidelines\n\nWhat's your experience with AI in hiring?",
    type: "text" as const,
    communitySlug: "ai-ml",
  },

  // Freelancing
  {
    title: "How I increased my freelance rates by 300% in 2 years",
    content: "I went from charging $50/hour to $200/hour in 2 years. Here's how:\n\n**Year 1:**\n- Built a strong portfolio\n- Specialized in a niche\n- Improved my skills\n- Raised rates by 50%\n\n**Year 2:**\n- Focused on high-value clients\n- Offered premium services\n- Built recurring revenue\n- Raised rates by 100%\n\n**Key strategies:**\n- Value-based pricing\n- Long-term relationships\n- Premium positioning\n- Continuous learning\n\n**Lesson:** Don't compete on price, compete on value.",
    type: "text" as const,
    communitySlug: "freelancing",
  },
  {
    title: "Client red flags: When to walk away from a project",
    content: "After 5 years of freelancing, I've learned to spot problematic clients early. Here are the red flags:\n\n**Communication issues:**\n- Slow to respond\n- Unclear requirements\n- Constant scope changes\n- Unrealistic expectations\n\n**Payment problems:**\n- Haggling over rates\n- Late payments\n- Partial payments\n- No contract\n\n**Project issues:**\n- Unrealistic deadlines\n- Poor planning\n- No clear goals\n- Micromanagement\n\n**My rule:** If you see 3+ red flags, walk away. It's not worth the stress.",
    type: "text" as const,
    communitySlug: "freelancing",
  },

  // Indie Hackers
  {
    title: "My $0 to $10k MRR journey with a productivity app",
    content: "I built a productivity app in my spare time and hit $10k MRR in 18 months. Here's the breakdown:\n\n**Month 1-6:**\n- Built MVP\n- Launched on Product Hunt\n- Got first 100 users\n- $0 revenue\n\n**Month 7-12:**\n- Added premium features\n- Implemented pricing\n- Reached $1k MRR\n- Focused on retention\n\n**Month 13-18:**\n- Scaled marketing\n- Improved product\n- Hit $10k MRR\n- Hired first employee\n\n**Key learnings:**\n- Start with a problem you have\n- Focus on user feedback\n- Don't optimize too early\n- Build in public",
    type: "text" as const,
    communitySlug: "indie-hackers",
  },
  {
    title: "The one feature that 10x'd my app's growth",
    content: "I added a simple feature that completely changed my app's trajectory: automated onboarding emails.\n\n**Before:**\n- 20% user activation\n- High churn rate\n- Manual follow-ups\n- Slow growth\n\n**After:**\n- 60% user activation\n- Reduced churn by 40%\n- Automated scaling\n- 10x faster growth\n\n**The feature:**\n- Welcome email series\n- Feature tutorials\n- Success stories\n- Re-engagement campaigns\n\n**Key insight:** Sometimes the simplest features have the biggest impact.",
    type: "text" as const,
    communitySlug: "indie-hackers",
  },
];

const dummyComments = [
  "This is exactly what I needed! Thanks for sharing your experience.",
  "I've been thinking about this too. What tech stack did you use?",
  "Great insights! I'm going to try this approach for my project.",
  "I disagree with point #3. In my experience, it's better to...",
  "This is really helpful. Do you have any resources you'd recommend?",
  "I'm currently going through something similar. How long did this take you?",
  "Interesting perspective! I never thought about it that way.",
  "Thanks for the detailed breakdown. This gives me a clear roadmap.",
  "I've tried this before and it didn't work for me. Maybe I was doing it wrong?",
  "This is gold! Bookmarking this for future reference.",
  "I'm curious about the ROI. What were your actual results?",
  "This approach seems risky. What's your backup plan?",
  "I love how you broke this down step by step. Very actionable!",
  "Have you considered the long-term implications of this strategy?",
  "This is exactly the kind of content I come here for. Thank you!",
  "I'm skeptical about these results. Can you share more data?",
  "This gives me hope for my own project. Thanks for the motivation!",
  "I've been following your journey. Great to see your progress!",
  "What tools did you use to track these metrics?",
  "This is a game-changer. I'm implementing this tomorrow!",
];

export const seedDummyData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create dummy users first
    const userIds: Id<"users">[] = [];
    
    for (const userData of dummyUsers) {
      const userId = await ctx.db.insert("users", {
        name: userData.name,
        email: userData.email,
        isAnonymous: false,
      });
      userIds.push(userId);
    }

    // Create communities
    const communityIds: Id<"communities">[] = [];
    
    for (const communityData of dummyCommunities) {
      const creatorId = userIds[Math.floor(Math.random() * userIds.length)];
      
      const communityId = await ctx.db.insert("communities", {
        name: communityData.name,
        slug: communityData.slug,
        description: communityData.description,
        creatorId,
        memberCount: Math.floor(Math.random() * 1000) + 100,
        isPublic: true,
      });
      
      communityIds.push(communityId);
      
      // Add creator as member
      await ctx.db.insert("communityMembers", {
        communityId,
        userId: creatorId,
        role: "creator",
      });
      
      // Add some random members
      const numMembers = Math.floor(Math.random() * 50) + 10;
      const memberUserIds = [...userIds].sort(() => 0.5 - Math.random()).slice(0, numMembers);
      
      for (const memberId of memberUserIds) {
        if (memberId !== creatorId) {
          await ctx.db.insert("communityMembers", {
            communityId,
            userId: memberId,
            role: "member",
          });
        }
      }
    }

    // Create posts
    const postIds: Id<"posts">[] = [];
    
    for (const postData of dummyPosts) {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", postData.communitySlug))
        .unique();
      
      if (!community) continue;
      
      const authorId = userIds[Math.floor(Math.random() * userIds.length)];
      const now = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Random time in last 30 days
      const upvotes = Math.floor(Math.random() * 100) + 1;
      const downvotes = Math.floor(Math.random() * 20);
      
      const postId = await ctx.db.insert("posts", {
        title: postData.title,
        content: postData.content,
        type: postData.type,
        communityId: community._id,
        authorId,
        upvotes,
        downvotes,
        commentCount: 0, // Will be updated when comments are added
        hotScore: (upvotes - downvotes) * Math.log10(Math.max(Math.abs(upvotes - downvotes), 1)) + (now - 1134028003000) / 45000,
      });
      
      postIds.push(postId);
      
      // Add some votes
      const numVotes = Math.floor(Math.random() * 50) + 10;
      const voterIds = [...userIds].sort(() => 0.5 - Math.random()).slice(0, numVotes);
      
      for (const voterId of voterIds) {
        if (voterId !== authorId) {
          const voteType = Math.random() > 0.1 ? "up" : "down"; // 90% upvotes
          await ctx.db.insert("votes", {
            userId: voterId,
            targetId: postId,
            targetType: "post",
            voteType,
          });
        }
      }
    }

    // Create comments
    for (const postId of postIds) {
      const numComments = Math.floor(Math.random() * 15) + 3;
      
      for (let i = 0; i < numComments; i++) {
        const authorId = userIds[Math.floor(Math.random() * userIds.length)];
        const content = dummyComments[Math.floor(Math.random() * dummyComments.length)];
        const upvotes = Math.floor(Math.random() * 20) + 1;
        const downvotes = Math.floor(Math.random() * 5);
        
        const commentId = await ctx.db.insert("comments", {
          content,
          postId,
          authorId,
          upvotes,
          downvotes,
          depth: 0, // Top-level comments for now
        });
        
        // Add some votes to comments
        const numVotes = Math.floor(Math.random() * 10) + 1;
        const voterIds = [...userIds].sort(() => 0.5 - Math.random()).slice(0, numVotes);
        
        for (const voterId of voterIds) {
          if (voterId !== authorId) {
            const voteType = Math.random() > 0.15 ? "up" : "down"; // 85% upvotes
            await ctx.db.insert("votes", {
              userId: voterId,
              targetId: commentId,
              targetType: "comment",
              voteType,
            });
          }
        }
      }
      
      // Update post comment count
      const post = await ctx.db.get(postId);
      if (post) {
        await ctx.db.patch(postId, {
          commentCount: numComments,
        });
      }
    }

    return {
      usersCreated: userIds.length,
      communitiesCreated: communityIds.length,
      postsCreated: postIds.length,
      message: "Dummy data seeded successfully! The platform now has realistic test data while maintaining all functionality for new users.",
    };
  },
});

export const clearDummyData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear all data except users (to preserve authentication)
    const votes = await ctx.db.query("votes").collect();
    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    const comments = await ctx.db.query("comments").collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const posts = await ctx.db.query("posts").collect();
    for (const post of posts) {
      await ctx.db.delete(post._id);
    }

    const members = await ctx.db.query("communityMembers").collect();
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    const communities = await ctx.db.query("communities").collect();
    for (const community of communities) {
      await ctx.db.delete(community._id);
    }

    const notifications = await ctx.db.query("notifications").collect();
    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }
    
    return { message: "All dummy data cleared successfully!" };
  },
}); 