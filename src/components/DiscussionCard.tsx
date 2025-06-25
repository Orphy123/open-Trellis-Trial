
import { MessageSquare, Heart, Share2, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DiscussionCardProps {
  title: string;
  content: string;
  author: string;
  timeAgo: string;
  replies: number;
  likes: number;
  category: string;
  isHot?: boolean;
}

export const DiscussionCard = ({
  title,
  content,
  author,
  timeAgo,
  replies,
  likes,
  category,
  isHot = false,
}: DiscussionCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover-scale cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{author}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isHot && (
            <Badge className="bg-red-100 text-red-800 animate-pulse">🔥 Hot</Badge>
          )}
          <Badge variant="secondary">{category}</Badge>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 story-link">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{content}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
            <MessageSquare className="h-4 w-4 mr-1" />
            {replies}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
            <Heart className="h-4 w-4 mr-1" />
            {likes}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
