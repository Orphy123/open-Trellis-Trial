import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Users, Crown, UserPlus, UserMinus, TrendingUp } from "lucide-react";

interface CommunityListProps {
  onSelectCommunity: (slug: string) => void;
}

export function CommunityList({ onSelectCommunity }: CommunityListProps) {
  const communities = useQuery(api.communities.list, { limit: 10 });
  const userCommunities = useQuery(api.communities.getUserCommunities);
  const joinCommunity = useMutation(api.communities.join);
  const leaveCommunity = useMutation(api.communities.leave);

  const handleJoin = async (communityId: Id<"communities">) => {
    try {
      await joinCommunity({ communityId });
      toast.success("Welcome to the community! 🎉");
    } catch (error) {
      toast.error("Failed to join community");
    }
  };

  const handleLeave = async (communityId: Id<"communities">) => {
    try {
      await leaveCommunity({ communityId });
      toast.success("Left community");
    } catch (error) {
      toast.error("Failed to leave community");
    }
  };

  const userCommunityIds = new Set(userCommunities?.map(c => c._id) || []);

  return (
    <div className="space-y-6">
      {/* User's Communities */}
      {userCommunities && userCommunities.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <Crown className="w-5 h-5 text-orange-500" />
            Your Communities
          </h3>
          <div className="space-y-3">
            {userCommunities?.map((community) => (
              <div key={community._id} className="group">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                  <button
                    onClick={() => onSelectCommunity(community.slug)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                      r/{community.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {community.memberCount} members
                    </div>
                  </button>
                  {community.role !== "creator" && (
                    <button
                      onClick={() => handleLeave(community._id)}
                      className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-300"
                      title="Leave community"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Communities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Popular Communities
        </h3>
        {communities ? (
          <div className="space-y-3">
            {communities.map((community) => (
              <div key={community._id} className="group">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                  <button
                    onClick={() => onSelectCommunity(community.slug)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                      r/{community.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {community.memberCount} members
                    </div>
                  </button>
                  {!userCommunityIds.has(community._id) && (
                    <button
                      onClick={() => handleJoin(community._id)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300"
                      title="Join community"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading communities...</p>
          </div>
        )}
      </div>
    </div>
  );
}