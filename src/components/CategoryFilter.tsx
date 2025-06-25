
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const categories = [
  { id: "all", name: "All", count: 142, color: "bg-gray-100 text-gray-800" },
  { id: "startups", name: "Startups", count: 45, color: "bg-green-100 text-green-800" },
  { id: "funding", name: "Funding", count: 23, color: "bg-emerald-100 text-emerald-800" },
  { id: "networking", name: "Networking", count: 31, color: "bg-teal-100 text-teal-800" },
  { id: "tech", name: "Tech", count: 28, color: "bg-lime-100 text-lime-800" },
  { id: "marketing", name: "Marketing", count: 15, color: "bg-green-100 text-green-800" },
];

export const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
              activeCategory === category.id ? "bg-green-50 border-l-4 border-green-500" : ""
            }`}
          >
            <span className="font-medium text-gray-700">{category.name}</span>
            <Badge className={category.color}>{category.count}</Badge>
          </button>
        ))}
      </div>
    </div>
  );
};
