"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Sparkles } from "lucide-react";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-800 mb-2">
          {flow === "signIn" ? "Welcome Back!" : "Join the Community"}
        </h2>
        <p className="text-gray-600 font-medium">
          {flow === "signIn" 
            ? "Sign in to continue your journey" 
            : "Create your account and start building"
          }
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-500 transition-colors duration-300" />
            <input
              className="auth-input-field pl-12"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-500 transition-colors duration-300" />
            <input
              className="auth-input-field pl-12 pr-12"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors duration-300 micro-bounce"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button 
          className="auth-button micro-bounce group" 
          type="submit" 
          disabled={submitting}
        >
          <div className="flex items-center justify-center gap-3">
            {flow === "signIn" ? (
              <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            )}
            {submitting ? "Processing..." : (flow === "signIn" ? "Sign In" : "Sign Up")}
          </div>
        </button>

        <div className="text-center">
          <span className="text-gray-600 font-medium">
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300 micro-bounce"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
        </div>
      </div>

      <button 
        className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 micro-bounce group relative overflow-hidden"
        onClick={() => void signIn("anonymous")}
      >
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          Quick Anonymous Access
        </div>
      </button>

      <div className="text-center text-sm text-gray-500 font-medium">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
}