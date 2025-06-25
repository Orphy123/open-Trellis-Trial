"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-white/30 text-gray-700 rounded-lg font-semibold hover:bg-white hover:border-orange-300 hover:text-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 micro-bounce group"
      onClick={() => void signOut()}
    >
      <div className="flex items-center gap-2">
        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        Sign out
      </div>
    </button>
  );
}