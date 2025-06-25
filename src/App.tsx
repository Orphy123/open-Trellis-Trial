import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { CommunityList } from "./components/CommunityList";
import { PostList } from "./components/PostList";
import { CreatePost } from "./components/CreatePost";
import { CreateCommunity } from "./components/CreateCommunity";
import { PostDetail } from "./components/PostDetail";
import { SearchBar } from "./components/SearchBar";
import { UserProfile } from "./components/UserProfile";
import { NotificationPanel } from "./components/NotificationPanel";
import { Id } from "../convex/_generated/dataModel";
import { Menu, X, Plus, Users, Home, TrendingUp, User, Bell, MessageSquare } from "lucide-react";

type View = "home" | "community" | "post" | "create-post" | "create-community" | "profile";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Id<"posts"> | null>(null);
  const [sortBy, setSortBy] = useState<"new" | "old">("new");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const loggedInUser = useQuery(api.users.loggedInUser);
  const unreadCount = useQuery(api.notifications.getUnreadCount);

  const handleViewCommunity = (communitySlug: string) => {
    setSelectedCommunity(communitySlug);
    setCurrentView("community");
    setSidebarOpen(false);
  };

  const handleViewPost = (postId: Id<"posts">) => {
    setSelectedPost(postId);
    setCurrentView("post");
  };

  const handleCreatePost = () => {
    setCurrentView("create-post");
  };

  const handleCreateCommunity = () => {
    setCurrentView("create-community");
  };

  const handleViewProfile = () => {
    setCurrentView("profile");
    setSidebarOpen(false);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedCommunity(null);
    setSelectedPost(null);
  };

  const toggleNotifications = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Unauthenticated>
        {/* Full-screen sign-in page without navbar */}
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
          <div className="w-full max-w-md animate-scale-in">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl animate-float hover:shadow-green-500/25 transition-all duration-300 overflow-hidden">
                  <img 
                    src="/src/OpenTrellis Logo copy.jpeg" 
                    alt="OpenTrellis Logo" 
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-black text-white mb-4 text-shadow animate-slide-in-up">
                Welcome to{" "}
                <span className="gradient-text bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                  OpenTrellis
                </span>
              </h1>
              <p className="text-lg text-white/90 font-medium animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                A modern community platform for entrepreneurs, builders, and creators
              </p>
            </div>
            <div className="card-modern animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <SignInForm />
            </div>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        {/* Header - Clean and minimal design */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Brand Section */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                    <img 
                      src="/src/OpenTrellis Logo copy.jpeg" 
                      alt="OpenTrellis Logo" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <button
                    onClick={handleBackToHome}
                    className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors duration-300 truncate"
                  >
                    OpenTrellis
                  </button>
                </div>
                
                {/* Desktop Search */}
                <div className="hidden lg:block flex-1 max-w-md ml-8">
                  <SearchBar />
                </div>
              </div>

              {/* Desktop Actions - Icon-based */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={toggleNotifications}
                  className="relative p-2.5 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300 group"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleViewProfile}
                  className="p-2.5 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300 group"
                  title="Profile"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </button>
                <button
                  onClick={handleCreateCommunity}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-green-300 hover:text-green-700 transition-all duration-300 group"
                >
                  <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Create Community
                </button>
                <button
                  onClick={handleCreatePost}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300 group"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Post
                </button>
                <div className="ml-2">
                  <SignOutButton />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={toggleNotifications}
                  className="relative p-2.5 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <SignOutButton />
              </div>
            </div>

            {/* Mobile/Tablet Search - Centered */}
            <div className="lg:hidden pb-4 pt-2 flex justify-center">
              <div className="w-full max-w-md">
                <SearchBar />
              </div>
            </div>
          </div>
        </header>

        {/* Notification Panel */}
        <NotificationPanel 
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
          onSelectPost={handleViewPost}
        />

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-scale-in" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className={`lg:col-span-1 ${
              sidebarOpen 
                ? 'fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl animate-slide-in-right lg:relative lg:inset-auto lg:w-auto lg:shadow-none' 
                : 'hidden lg:block'
            }`}>
              <div className="h-full overflow-y-auto p-6 lg:p-0 pt-20 lg:pt-0">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800">Navigation</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Navigation Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5 text-green-600" />
                      Navigation
                    </h3>
                    <nav className="space-y-2">
                      <button
                        onClick={handleBackToHome}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                          currentView === "home" 
                            ? "bg-green-50 text-green-700 border-l-4 border-green-500" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        Home Feed
                      </button>
                      <button
                        onClick={handleViewProfile}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                          currentView === "profile" 
                            ? "bg-green-50 text-green-700 border-l-4 border-green-500" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                    </nav>
                  </div>

                  {/* Mobile Actions */}
                  <div className="lg:hidden space-y-3">
                    <button
                      onClick={handleCreatePost}
                      className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </button>
                    <button
                      onClick={handleCreateCommunity}
                      className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Create Community
                    </button>
                  </div>

                  <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                    <CommunityList onSelectCommunity={handleViewCommunity} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {currentView === "home" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col items-center gap-4">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        Home Feed
                      </h2>
                      {/* Sort toggle */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortBy("new")}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            sortBy === "new"
                              ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                              : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                          }`}
                        >
                          Most Recent
                        </button>
                        <button
                          onClick={() => setSortBy("old")}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            sortBy === "old"
                              ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                              : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                          }`}
                        >
                          Oldest First
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                    <PostList
                      sortBy={sortBy}
                      onSelectPost={handleViewPost}
                      onSelectCommunity={handleViewCommunity}
                    />
                  </div>
                </div>
              )}

              {currentView === "community" && selectedCommunity && (
                <div className="animate-slide-in-up">
                  <PostList
                    communitySlug={selectedCommunity}
                    sortBy={sortBy}
                    onSelectPost={handleViewPost}
                    onSelectCommunity={handleViewCommunity}
                  />
                </div>
              )}

              {currentView === "post" && selectedPost && (
                <div className="animate-slide-in-up">
                  <PostDetail
                    postId={selectedPost}
                    onBack={handleBackToHome}
                  />
                </div>
              )}

              {currentView === "create-post" && (
                <div className="animate-scale-in">
                  <CreatePost onSuccess={handleBackToHome} />
                </div>
              )}

              {currentView === "create-community" && (
                <div className="animate-scale-in">
                  <CreateCommunity onSuccess={handleBackToHome} />
                </div>
              )}

              {currentView === "profile" && (
                <div className="animate-scale-in">
                  <UserProfile onBack={handleBackToHome} />
                </div>
              )}
            </div>
          </div>
        </main>
      </Authenticated>

      <Toaster 
        theme="light"
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            color: 'rgb(21 128 61)',
            borderRadius: '1rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}