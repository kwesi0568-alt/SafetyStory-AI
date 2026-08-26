import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Film,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  Shield,
  Calendar,
  Layers,
} from "lucide-react";
import { SafetyCampaign } from "../types";

interface LibraryViewProps {
  campaigns: SafetyCampaign[];
  onSelectCampaign: (campaign: SafetyCampaign) => void;
  onDeleteCampaign: (id: string) => void;
  onExportCampaign: (campaign: SafetyCampaign) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  campaigns,
  onSelectCampaign,
  onDeleteCampaign,
  onExportCampaign,
}) => {
  const [search, setSearch] = useState("");

  const filtered = campaigns.filter(
    (c) =>
      c.campaignTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.topic.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Campaign Archives &bull; Showcase Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
            Saved Storytelling Campaigns ({campaigns.length})
          </h2>
          <p className="text-xs text-[#1C1C1C]/60 font-serif italic mt-0.5">
            Explore ready-to-deploy safety storytelling campaigns across various industrial sectors.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#1C1C1C]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/10 rounded-sm pl-10 pr-4 py-2 text-xs font-serif text-[#1C1C1C] placeholder-[#1C1C1C]/40 focus:border-[#FF5F1F] focus:outline-none"
          />
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((camp) => (
          <div
            key={camp.id}
            className="p-6 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm hover:border-[#1C1C1C]/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm bg-[#FFF9F5] text-[#FF5F1F] border border-[#FF5F1F]/20 tracking-wider">
                  {camp.industry.split(" ")[0]}
                </span>
                <span className="text-[10px] text-[#1C1C1C]/40 font-mono">
                  {new Date(camp.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-serif italic text-[#1C1C1C] group-hover:text-[#FF5F1F] transition-colors leading-snug">
                {camp.campaignTitle}
              </h3>

              <p className="text-xs text-[#FF5F1F] font-serif italic">
                &ldquo;{camp.slogan}&rdquo;
              </p>

              <p className="text-xs text-[#1C1C1C]/70 font-serif line-clamp-2 leading-relaxed">
                {camp.emotionalHook}
              </p>

              {/* Impact Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 text-center">
                  <span className="text-[9px] uppercase font-bold text-[#1C1C1C]/50 tracking-wider block">
                    Memorability
                  </span>
                  <span className="text-xs font-serif font-bold text-[#1C1C1C]">
                    {camp.impactMetrics?.memorabilityScore || 94}%
                  </span>
                </div>
                <div className="p-2 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 text-center">
                  <span className="text-[9px] uppercase font-bold text-[#1C1C1C]/50 tracking-wider block">
                    Resonance
                  </span>
                  <span className="text-xs font-serif font-bold text-emerald-700">
                    {camp.impactMetrics?.emotionalResonance || 92}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#1C1C1C]/10 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onExportCampaign(camp)}
                  className="p-2 rounded-sm bg-[#F9F8F6] hover:bg-[#1C1C1C] text-[#1C1C1C] hover:text-white border border-[#1C1C1C]/10 transition cursor-pointer"
                  title="Export Dossier"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteCampaign(camp.id)}
                  className="p-2 rounded-sm bg-[#F9F8F6] hover:bg-red-600 text-[#1C1C1C]/60 hover:text-white border border-[#1C1C1C]/10 transition cursor-pointer"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onSelectCampaign(camp)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white text-[11px] font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                <span>Open Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
