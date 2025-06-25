import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ChevronUp, ChevronDown, MessageCircle, Reply, User } from "lucide-react";
import { useState } from "react";

import { Id } from "../../convex/_generated/dataModel";

interface CommentListProps {
  postId: Id<"posts">;
}

export function CommentList({ postId }: CommentListProps) {
  const comments = useQuery(api.comments.listByPost, { postId });

  if (!comments) {
    return (
      <div className="card-modern text-center py-12">
        <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="card-modern text-center py-12">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium text-lg">No comments yet</p>
        <p className="text-gray-400">Be the first to share your thoughts!</p>
      </div>
    );
  }

  // Group comments by parent
  const topLevelComments = comments.filter(c => !c.parentId);
  const commentsByParent = comments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) acc[comment.parentId] = [];
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, typeof comments>);

  return (
    <div className="card-modern">
      <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-green-600" />
        Comments ({comments.length})
      </h3>
      <div className="space-y-6">
        {topLevelComments.map((comment, index) => (
          <div key={comment._id} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <Comment
              comment={comment}
              replies={commentsByParent[comment._id] || []}
              postId={postId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface CommentProps {
  comment: any;
  replies: any[];
  postId: Id<"posts">;
}

function Comment({ comment, replies, postId }: CommentProps) {
  const userVote = useQuery(api.comments.getUserVote, { commentId: comment._id });
  const voteOnComment = useMutation(api.comments.vote);
  const createComment = useMutation(api.comments.create);

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (voteType: "up" | "down") => {
    try {
      await voteOnComment({ commentId: comment._id, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({
        content: replyContent,
        postId,
        parentId: comment._id,
      });
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Failed to create reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const score = comment.upvotes - comment.downvotes;

  return (
    <div className={`${comment.depth > 0 ? "ml-8 border-l-4 border-green-100 pl-6" : ""}`}>
      <div className="comment-card group">
        <div className="flex gap-4">
          {/* Vote buttons - smaller and sleeker */}
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() => handleVote("up")}
              className={`vote-btn ${userVote === "up" ? "active-up" : ""} group`}
            >
              <ChevronUp className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <span className={`text-sm font-bold ${
              score > 0 ? "text-green-600" : score < 0 ? "text-red-600" : "text-gray-500"
            }`}>
              {score}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`vote-btn ${userVote === "down" ? "active-down" : ""} group`}
            >
              <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* Comment content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-2">
                {comment.author?.profile?.profilePictureUrl ? (
                  <img
                    src={comment.author.profile.profilePictureUrl}
                    alt="Profile"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-bold text-gray-800">
                  u/{comment.author?.profile?.displayName || comment.author?.name || "Unknown"}
                </span>
              </div>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(comment._creationTime))} ago</span>
            </div>

            <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed font-medium">
              {comment.content}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors duration-300 font-medium micro-bounce group"
              >
                <Reply className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                Reply
              </button>
            </div>

            {/* Reply form */}
            {showReplyForm && (
              <form onSubmit={handleSubmitReply} className="mt-6 p-4 bg-gray-50 rounded-xl animate-scale-in">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a thoughtful reply..."
                  className="form-textarea focus-ring"
                  rows={3}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent("");
                    }}
                    className="btn-ghost micro-bounce"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyContent.trim() || isSubmitting}
                    className="btn-primary micro-bounce group"
                  >
                    <div className="flex items-center gap-2">
                      <Reply className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      {isSubmitting ? "Posting..." : "Reply"}
                    </div>
                  </button>
                </div>
              </form>
            )}

            {/* Replies */}
            {replies.length > 0 && (
              <div className="mt-6 space-y-4">
                {replies.map((reply) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    replies={[]}
                    postId={postId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}