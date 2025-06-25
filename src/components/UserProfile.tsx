import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { User, Camera, Save, ArrowLeft, Mail, Calendar, Upload } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const currentUser = useQuery(api.users.getCurrentUserProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.index.generateUploadUrl);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form when user data loads
  useState(() => {
    if (currentUser && !name) {
      setName(currentUser.name || "");
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();
      
      // Update profile with new image
      await updateProfile({ profilePicture: storageId });
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="card-modern text-center py-12">
        <div className="loading-spinner w-12 h-12 mx-auto mb-6"></div>
        <p className="text-gray-500 font-medium text-lg">Loading profile...</p>
      </div>
    );
  }

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

      {/* Profile Card */}
      <div className="card-modern">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl overflow-hidden">
                {currentUser.profilePicture ? (
                  <img
                    src={`${import.meta.env.VITE_CONVEX_URL}/api/storage/${currentUser.profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              
              {/* Upload overlay */}
              <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <div className="text-white text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">
                    {isUploading ? "Uploading..." : "Change Photo"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Upload className="w-4 h-4 animate-bounce" />
                Uploading image...
              </div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                Profile
              </h1>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary-small micro-bounce group"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    Edit Profile
                  </div>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your display name"
                    className="form-input focus-ring"
                    required
                    maxLength={50}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This is how your name will appear on posts and comments
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!name.trim() || isSubmitting}
                    className="btn-primary-small micro-bounce group"
                  >
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(currentUser.name || "");
                    }}
                    className="btn-secondary-small micro-bounce"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wide">
                      <User className="w-4 h-4" />
                      Display Name
                    </div>
                    <div className="text-xl font-bold text-gray-800">
                      {currentUser.name || "Anonymous User"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wide">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                    <div className="text-lg text-gray-700 font-medium">
                      {currentUser.email || "No email provided"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wide">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </div>
                    <div className="text-lg text-gray-700 font-medium">
                      {formatDistanceToNow(new Date(currentUser._creationTime))} ago
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-modern text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-black text-gray-800 mb-2">Active</div>
          <div className="text-gray-600 font-medium">Account Status</div>
        </div>

        <div className="card-modern text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-black text-gray-800 mb-2">
            {Math.ceil((Date.now() - currentUser._creationTime) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-gray-600 font-medium">Days Active</div>
        </div>

        <div className="card-modern text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-black text-gray-800 mb-2">Verified</div>
          <div className="text-gray-600 font-medium">Email Status</div>
        </div>
      </div>
    </div>
  );
}