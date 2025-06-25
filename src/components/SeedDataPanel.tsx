import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Database, Trash2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

interface SeedDataPanelProps {
  onBack?: () => void;
}

export function SeedDataPanel({ onBack }: SeedDataPanelProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastAction, setLastAction] = useState<{
    type: "seed" | "clear";
    success: boolean;
    message: string;
  } | null>(null);

  const seedData = useMutation(api.seedData.seedDummyData);
  const clearData = useMutation(api.seedData.clearDummyData);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setLastAction(null);
    
    try {
      const result = await seedData();
      setLastAction({
        type: "seed",
        success: true,
        message: `Successfully seeded data! Created ${result.usersCreated} users, ${result.communitiesCreated} communities, and ${result.postsCreated} posts.`,
      });
    } catch (error) {
      setLastAction({
        type: "seed",
        success: false,
        message: `Failed to seed data: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all dummy data? This action cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    setLastAction(null);
    
    try {
      const result = await clearData();
      setLastAction({
        type: "clear",
        success: true,
        message: result.message,
      });
    } catch (error) {
      setLastAction({
        type: "clear",
        success: false,
        message: `Failed to clear data: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Seed Data Panel</h2>
          </div>
        </div>
        <p className="mt-2 text-gray-600">
          Populate the platform with realistic test data for development and testing purposes.
        </p>
      </div>

      {/* Seed Data Card */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Management
          </CardTitle>
          <CardDescription>
            Add or remove test data to simulate a populated platform environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              onClick={handleSeedData}
              disabled={isSeeding || isClearing}
              className="w-full"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding Data...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Seed Dummy Data
                </>
              )}
            </Button>
            
            <Button
              onClick={handleClearData}
              disabled={isSeeding || isClearing}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing Data...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </>
              )}
            </Button>
          </div>

          {lastAction && (
            <div className={`p-3 rounded-md border ${
              lastAction.success 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <div className="flex items-start gap-2">
                {lastAction.success ? (
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm">{lastAction.message}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>What gets seeded:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>10 dummy users with realistic names</li>
              <li>8 communities across different topics</li>
              <li>15+ posts with engaging content</li>
              <li>Comments and votes on posts</li>
              <li>Community memberships</li>
            </ul>
            <p className="mt-2">
              <strong>Note:</strong> New users can still sign up, post, and interact normally with the seeded data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 