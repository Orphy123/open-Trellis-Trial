import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, CheckCheck, MessageSquare, ThumbsUp, Users, X, User } from "lucide-react";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost?: (postId: Id<"posts">) => void;
}

export function NotificationPanel({ isOpen, onClose, onSelectPost }: NotificationPanelProps) {
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  
  const notifications = useQuery(api.notifications.getUserNotifications, {
    limit: 20,
    onlyUnread: showOnlyUnread
  });
  
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead({ notificationId: notification._id });
    }
    
    if (notification.postId && onSelectPost) {
      onSelectPost(notification.postId);
      onClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_post":
        return <Users className="w-4 h-4 text-green-600" />;
      case "post_vote":
      case "comment_vote":
        return <ThumbsUp className="w-4 h-4 text-blue-600" />;
      case "post_comment":
      case "comment_reply":
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-16 right-4 z-50 w-96 max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setShowOnlyUnread(false)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                !showOnlyUnread
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setShowOnlyUnread(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                showOnlyUnread
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications === undefined ? (
            <div className="p-8 text-center">
              <div className="loading-spinner w-6 h-6 mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {showOnlyUnread ? "No unread notifications" : "No notifications yet"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {showOnlyUnread 
                  ? "You're all caught up!" 
                  : "We'll notify you when something happens"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification, index) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer animate-slide-in-up ${
                    !notification.isRead ? "bg-green-50/50" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        {notification.triggeredByUser && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{notification.triggeredByUser.name || "Someone"}</span>
                          </div>
                        )}
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(notification._creationTime))} ago</span>
                      </div>
                      
                      {notification.community && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            r/{notification.community.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}