
import { Plus, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CreatePostButton = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-6 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-white/20 p-2 rounded-lg">
          <Pen className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">Share Your Ideas</h3>
      </div>
      <p className="text-white/90 mb-4 text-sm">
        Connect with fellow Richmond entrepreneurs, share insights, and grow together.
      </p>
      <Button className="w-full bg-white text-green-600 hover:bg-gray-100 transition-colors">
        <Plus className="h-4 w-4 mr-2" />
        Start a Discussion
      </Button>
    </div>
  );
};
