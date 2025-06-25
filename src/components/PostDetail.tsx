import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ChevronUp, ChevronDown, MessageCircle, ArrowLeft, ExternalLink, Send, User } from "lucide-react";
import { useState } from "react";
import { CommentList } from "./CommentList";

import { Id } from "../../convex/_generated/dataModel";

interface PostDetailProps {
  postId: Id<"posts">;
  onBack: () => void;
}

export function PostDetail({ postId, onBack }: PostDetailProps) {
  const post = useQuery(api.posts.getById, { id: postId });
  const userVote = useQuery(api.posts.getUserVote, { postId });
  const voteOnPost = useMutation(api.posts.vote);
  const createComment = useMutation(api.comments.create);

  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (voteType: "up" | "down") => {
    try {
      await voteOnPost({ postId, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({
        content: commentContent,
        postId,
      });
      setCommentContent("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="card-modern text-center py-12">
        <div className="loading-spinner w-12 h-12 mx-auto mb-6"></div>
        <p className="text-gray-500 font-medium text-lg">Loading post...</p>
      </div>
    );
  }

  const score = post.upvotes - post.downvotes;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium micro-bounce group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to feed
      </button>

      {/* Post */}
      <div className="post-card animate-slide-in-up">
        <div className="flex">
          {/* Vote buttons - smaller and sleeker */}
          <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 space-y-3">
            <button
              onClick={() => handleVote("up")}
              className={`vote-btn ${userVote === "up" ? "active-up" : ""} group`}
            >
              <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <span className={`text-lg font-black ${
              score > 0 ? "text-green-600" : score < 0 ? "text-red-600" : "text-gray-500"
            }`}>
              {score > 999 ? `${(score / 1000).toFixed(1)}k` : score}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`vote-btn ${userVote === "down" ? "active-down" : ""} group`}
            >
              <ChevronDown className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* Post content */}
          <div className="flex-1 p-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
              {post.community && (
                <>
                  <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    r/{post.community.name}
                  </span>
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

            <h1 className="text-3xl font-black text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.type === "text" && post.content && (
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                  {post.content}
                </p>
              </div>
            )}

            {post.type === "link" && post.url && (
              <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-200">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-lg font-medium flex items-center gap-3 micro-bounce group"
                >
                  <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {post.url}
                </a>
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2 font-medium">
                <MessageCircle className="w-5 h-5" />
                {post.commentCount} comments
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment form */}
      <div className="card-modern animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-green-600" />
          Add a comment
        </h3>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="What are your thoughts? Share your perspective..."
            className="form-textarea focus-ring"
            rows={4}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentContent.trim() || isSubmitting}
              className="btn-primary micro-bounce group"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
        <CommentList postId={postId} />
      </div>
    </div>
  );
}