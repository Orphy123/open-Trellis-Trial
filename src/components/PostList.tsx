import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ChevronUp, ChevronDown, MessageCircle, ExternalLink, Users, Calendar, User } from "lucide-react";

import { Id } from "../../convex/_generated/dataModel";

interface PostListProps {
  communitySlug?: string;
  sortBy?: "new" | "old";
  onSelectPost: (postId: Id<"posts">) => void;
  onSelectCommunity: (slug: string) => void;
}

export function PostList({ communitySlug, sortBy = "new", onSelectPost, onSelectCommunity }: PostListProps) {
  const community = useQuery(
    api.communities.getBySlug,
    communitySlug ? { slug: communitySlug } : "skip"
  );
  
  const posts = useQuery(api.posts.list, {
    communityId: community?._id,
    sortBy: sortBy === "new" ? "new" : "new", // Map to existing API
    limit: 20,
  });

  const voteOnPost = useMutation(api.posts.vote);

  const handleVote = async (postId: Id<"posts">, voteType: "up" | "down") => {
    try {
      await voteOnPost({ postId, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  if (posts === undefined) {
    return (
      <div className="card-modern text-center py-12">
        <div className="loading-spinner w-12 h-12 mx-auto mb-6"></div>
        <p className="text-gray-500 font-medium text-lg">Loading amazing posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card-modern text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium text-lg">No posts found</p>
        <p className="text-gray-400 mt-2">Be the first to share something amazing!</p>
      </div>
    );
  }

  // Sort posts based on sortBy prop
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "old") {
      return a._creationTime - b._creationTime; // Oldest first
    } else {
      return b._creationTime - a._creationTime; // Newest first (default)
    }
  });

  return (
    <div className="space-y-6">
      {communitySlug && community && (
        <div className="card-modern animate-slide-in-up">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-800 mb-2">r/{community.name}</h1>
              <p className="text-gray-600 font-medium mb-4">{community.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="badge badge-primary">
                  <Users className="w-3 h-3 mr-1" />
                  {community.memberCount} members
                </div>
                <div className="badge bg-gray-100 text-gray-700">
                  <Calendar className="w-3 h-3 mr-1" />
                  Created {formatDistanceToNow(new Date(community._creationTime))} ago
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sortedPosts.map((post, index) => (
          <div key={post._id} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <PostCard
              post={post}
              onVote={handleVote}
              onSelectPost={onSelectPost}
              onSelectCommunity={onSelectCommunity}
              showCommunity={!communitySlug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface PostCardProps {
  post: any;
  onVote: (postId: Id<"posts">, voteType: "up" | "down") => void;
  onSelectPost: (postId: Id<"posts">) => void;
  onSelectCommunity: (slug: string) => void;
  showCommunity?: boolean;
}

function PostCard({ post, onVote, onSelectPost, onSelectCommunity, showCommunity = true }: PostCardProps) {
  const userVote = useQuery(api.posts.getUserVote, { postId: post._id });
  const score = post.upvotes - post.downvotes;

  return (
    <div className="post-card group">
      <div className="flex">
        {/* Vote buttons - smaller and sleeker */}
        <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 space-y-2">
          <button
            onClick={() => onVote(post._id, "up")}
            className={`vote-btn ${userVote === "up" ? "active-up" : ""} group`}
          >
            <ChevronUp className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <span className={`text-base font-bold ${
            score > 0 ? "text-green-600" : score < 0 ? "text-red-600" : "text-gray-500"
          }`}>
            {score > 999 ? `${(score / 1000).toFixed(1)}k` : score}
          </span>
          <button
            onClick={() => onVote(post._id, "down")}
            className={`vote-btn ${userVote === "down" ? "active-down" : ""} group`}
          >
            <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* Post content */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            {showCommunity && post.community && (
              <>
                <button
                  onClick={() => onSelectCommunity(post.community.slug)}
                  className="font-bold text-green-600 hover:text-green-700 hover:underline micro-bounce"
                >
                  r/{post.community.name}
                </button>
                <span>•</span>
              </>
            )}
            <div className="flex items-center gap-2">
              {post.author?.profile?.profilePictureUrl ? (
                <img
                  src={post.author.profile.profilePictureUrl}
                  alt="Profile"
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-400" />
              )}
              <span className="font-medium">
                Posted by u/{post.author?.profile?.displayName || post.author?.name || "Unknown"}
              </span>
            </div>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post._creationTime))} ago</span>
          </div>

          <button
            onClick={() => onSelectPost(post._id)}
            className="text-left w-full group"
          >
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 mb-3 line-clamp-2">
              {post.title}
            </h3>
            
            {post.type === "text" && post.content && (
              <p className="text-gray-600 line-clamp-3 mb-4 font-medium leading-relaxed">
                {post.content}
              </p>
            )}

            {post.type === "link" && post.url && (
              <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 micro-bounce"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  {post.url}
                </a>
              </div>
            )}
          </button>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <button
              onClick={() => onSelectPost(post._id)}
              className="flex items-center gap-2 hover:text-green-600 transition-colors duration-300 font-medium micro-bounce group"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              {post.commentCount} comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}