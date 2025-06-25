import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, TrendingUp, Users } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const communityResults = useQuery(
    api.communities.search,
    query.length > 2 ? { query, limit: 5 } : "skip"
  );

  const postResults = useQuery(
    api.posts.search,
    query.length > 2 ? { query, limit: 5 } : "skip"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 2);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-green-500 transition-colors duration-200" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onFocus={() => query.length > 2 && setShowResults(true)}
          placeholder="Search communities and posts..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-white/30 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100/50 outline-none transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium placeholder:text-gray-400"
        />
      </div>

      {showResults && (communityResults?.length || postResults?.length) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 z-50 max-h-96 overflow-y-auto animate-scale-in">
          {communityResults && communityResults.length > 0 && (
            <div className="p-3">
              <h3 className="text-xs font-bold text-gray-500 px-3 py-2 flex items-center gap-2 uppercase tracking-wide">
                <Users className="w-3 h-3" />
                Communities
              </h3>
              <div className="space-y-1">
                {communityResults.map((community) => (
                  <button
                    key={community._id}
                    onClick={handleResultClick}
                    className="w-full text-left px-3 py-2.5 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  >
                    <div className="font-semibold text-sm text-gray-800 group-hover:text-green-700">
                      r/{community.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {community.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {postResults && postResults.length > 0 && (
            <div className={`p-3 ${communityResults?.length ? 'border-t border-gray-100' : ''}`}>
              <h3 className="text-xs font-bold text-gray-500 px-3 py-2 flex items-center gap-2 uppercase tracking-wide">
                <TrendingUp className="w-3 h-3" />
                Posts
              </h3>
              <div className="space-y-1">
                {postResults.map((post) => (
                  <button
                    key={post._id}
                    onClick={handleResultClick}
                    className="w-full text-left px-3 py-2.5 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  >
                    <div className="font-semibold text-sm text-gray-800 truncate group-hover:text-green-700">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      r/{post.community?.name} • by u/{post.author?.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}