import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { FileText, Link, Image, Send, X } from "lucide-react";

interface CreatePostProps {
  onSuccess: () => void;
}

export function CreatePost({ onSuccess }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"text" | "link">("text");
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userCommunities = useQuery(api.communities.getUserCommunities);
  const createPost = useMutation(api.posts.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedCommunityId) return;

    setIsSubmitting(true);
    try {
      await createPost({
        title: title.trim(),
        content: type === "text" ? content.trim() : undefined,
        url: type === "link" ? url.trim() : undefined,
        type,
        communityId: selectedCommunityId as Id<"communities">,
      });
      toast.success("Post created successfully! 🎉");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create post");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-modern animate-scale-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Send className="w-5 h-5 text-white" />
          </div>
          Create a Post
        </h2>
        <button
          onClick={onSuccess}
          className="btn-icon text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Community Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Choose a community
          </label>
          <select
            value={selectedCommunityId}
            onChange={(e) => setSelectedCommunityId(e.target.value)}
            className="form-select focus-ring"
            required
          >
            <option value="">Select a community</option>
            {userCommunities?.map((community) => (
              <option key={community._id} value={community._id}>
                r/{community.name}
              </option>
            ))}
          </select>
        </div>

        {/* Post Type */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">
            Post Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType("text")}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 micro-bounce ${
                type === "text"
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <FileText className="w-8 h-8 mx-auto mb-3" />
              <div className="font-bold">Text Post</div>
              <div className="text-sm opacity-75">Share your thoughts</div>
            </button>
            <button
              type="button"
              onClick={() => setType("link")}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 micro-bounce ${
                type === "link"
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <Link className="w-8 h-8 mx-auto mb-3" />
              <div className="font-bold">Link Post</div>
              <div className="text-sm opacity-75">Share a link</div>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="An interesting title that grabs attention..."
            className="form-input focus-ring"
            required
            maxLength={300}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Make it catchy and descriptive
            </p>
            <p className="text-sm text-gray-400">
              {title.length}/300
            </p>
          </div>
        </div>

        {/* Content based on type */}
        {type === "text" && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Content (optional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, ideas, or story..."
              className="form-textarea focus-ring"
              rows={8}
            />
            <p className="text-sm text-gray-500 mt-2">
              Add details, context, or expand on your title
            </p>
          </div>
        )}

        {type === "link" && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="form-input focus-ring"
              required={type === "link"}
            />
            <p className="text-sm text-gray-500 mt-2">
              Share an interesting article, video, or resource
            </p>
          </div>
        )}

        {/* Submit buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onSuccess}
            className="btn-secondary micro-bounce"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !selectedCommunityId || isSubmitting}
            className="btn-primary micro-bounce group"
          >
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              {isSubmitting ? "Creating..." : "Create Post"}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}