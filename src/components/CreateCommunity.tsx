import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Users, Globe, Shield, Heart, X } from "lucide-react";

interface CreateCommunityProps {
  onSuccess: () => void;
}

export function CreateCommunity({ onSuccess }: CreateCommunityProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCommunity = useMutation(api.communities.create);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const slug = generateSlug(name);
    if (!slug) {
      toast.error("Please enter a valid community name");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommunity({
        name: name.trim(),
        slug,
        description: description.trim(),
      });
      toast.success("Community created successfully! 🎉");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create community");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-modern animate-scale-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          Create a Community
        </h2>
        <button
          onClick={onSuccess}
          className="btn-icon text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Community Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Community Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Startup Founders, Tech Enthusiasts, Creative Writers"
            className="form-input focus-ring"
            required
            maxLength={50}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Community URL: <span className="font-mono bg-gray-100 px-2 py-1 rounded">r/{generateSlug(name) || "your-community-name"}</span>
            </p>
            <p className="text-sm text-gray-400">
              {name.length}/50
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell people what this community is about. What topics will be discussed? What's the purpose?"
            className="form-textarea focus-ring"
            rows={6}
            required
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Help people understand what your community is all about
            </p>
            <p className="text-sm text-gray-400">
              {description.length}/500
            </p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Community Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Be Respectful</div>
                <div className="text-sm text-green-700">Keep discussions civil and constructive</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Stay On Topic</div>
                <div className="text-sm text-green-700">Keep posts relevant to the community</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">No Spam</div>
                <div className="text-sm text-green-700">Avoid excessive self-promotion</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Be Helpful</div>
                <div className="text-sm text-green-700">Contribute meaningfully to discussions</div>
              </div>
            </div>
          </div>
        </div>

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
            disabled={!name.trim() || !description.trim() || isSubmitting}
            className="btn-primary micro-bounce group"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              {isSubmitting ? "Creating..." : "Create Community"}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}