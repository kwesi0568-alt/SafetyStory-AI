import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  HardHat,
  Factory,
  Flame,
  Truck,
  Stethoscope,
  Ship,
  Compass,
  Zap,
} from "lucide-react";
import { PRESET_TOPICS } from "../data/presets";
import { PresetTopic, IndustryType } from "../types";

interface IdeaVaultProps {
  onSelectTopic: (topic: PresetTopic) => void;
}

export const IdeaVault: React.FC<IdeaVaultProps> = ({ onSelectTopic }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");

  const industries = ["All", "Construction & Rigging", "Manufacturing & Heavy Plant", "Energy, Oil/Gas & Utilities", "Logistics, Warehousing & Fleet", "Healthcare, Pharma & Labs", "Mining & Maritime"];

  const filteredTopics = PRESET_TOPICS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.hazard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || t.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-[#FFF9F5] border border-[#FF5F1F]/20 text-[#FF5F1F] text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5F1F]" />
          <span>Safety Idea Vault &bull; Curated Index</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif italic text-[#1C1C1C] tracking-tight">
          High-Stakes Technical Hazard Catalog
        </h2>
        <p className="text-sm text-[#1C1C1C]/70 font-serif italic max-w-xl mx-auto">
          Select any critical technical hazard or SOP protocol to immediately generate an entire multi-platform creative campaign.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-6 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#1C1C1C]/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hazard, SOP keyword, or category (e.g. LOTO, chemical, fall arrest, forklift)..."
              className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/10 rounded-sm pl-11 pr-4 py-3 text-xs sm:text-sm font-serif text-[#1C1C1C] placeholder-[#1C1C1C]/40 focus:border-[#FF5F1F] focus:outline-none transition"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  selectedIndustry === ind
                    ? "bg-[#1C1C1C] text-white shadow-sm"
                    : "bg-[#F9F8F6] text-[#1C1C1C]/60 hover:text-[#1C1C1C] border border-[#1C1C1C]/10"
                }`}
              >
                {ind.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-6 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm hover:border-[#1C1C1C]/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm bg-[#FFF9F5] text-[#FF5F1F] border border-[#FF5F1F]/20 tracking-wider">
                  {topic.category}
                </span>
                <span className="text-[10px] text-[#1C1C1C]/40 font-mono">
                  {topic.industry.split(" ")[0]}
                </span>
              </div>

              <h3 className="text-lg font-serif italic text-[#1C1C1C] group-hover:text-[#FF5F1F] transition-colors leading-snug">
                {topic.title}
              </h3>

              <p className="text-xs text-[#1C1C1C]/70 font-serif leading-relaxed line-clamp-2">
                {topic.shortDesc}
              </p>

              <div className="p-3.5 rounded-sm bg-[#FFF9F5] border-l-4 border-[#FF5F1F] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#FF5F1F] tracking-widest block font-sans">
                  Core Life-Saving Rule
                </span>
                <p className="text-xs text-[#1C1C1C] font-serif italic">
                  {topic.coreRule}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1C1C1C]/10 flex items-center justify-between">
              <span className="text-[10px] text-[#1C1C1C]/50 font-serif italic">
                Archetype: {topic.suggestedArchetype.split("/")[0]}
              </span>
              <button
                onClick={() => onSelectTopic(topic)}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white text-[11px] font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
