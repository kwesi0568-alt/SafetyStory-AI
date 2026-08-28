import React, { useState } from "react";
import {
  BookOpen,
  Film,
  ShieldCheck,
  Gamepad2,
  Palette,
  Clapperboard,
  Award,
  Sparkles,
  Download,
  Share2,
  TrendingUp,
  Heart,
  Eye,
  Zap,
  Lock,
} from "lucide-react";
import { SafetyCampaign } from "../types";
import { NarrativeView } from "./NarrativeView";
import { StoryboardView } from "./StoryboardView";
import { ToolboxTalkView } from "./ToolboxTalkView";
import { InteractiveSimView } from "./InteractiveSimView";
import { PosterStudioView } from "./PosterStudioView";
import { MultimediaView } from "./MultimediaView";
import { QuizView } from "./QuizView";

interface StudioViewProps {
  campaign: SafetyCampaign;
  onOpenExporter: () => void;
  onUpdateSceneImage?: (sceneNumber: number, imageUrl: string) => void;
}

export type StudioSubTab =
  | "story"
  | "storyboard"
  | "toolbox"
  | "simulator"
  | "posters"
  | "multimedia"
  | "quiz";

export const StudioView: React.FC<StudioViewProps> = ({
  campaign,
  onOpenExporter,
  onUpdateSceneImage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<StudioSubTab>("story");

  const metrics = campaign.impactMetrics || {
    memorabilityScore: 95,
    emotionalResonance: 93,
    clarityScore: 98,
    actionableImpact: 97,
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Campaign Banner & Impact Scorecard */}
      <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-[#1C1C1C] text-white">
                {campaign.industry}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-[#F5F2ED] text-[#1C1C1C] border border-[#1C1C1C]/10">
                {campaign.archetype}
              </span>
              <span className="text-[11px] font-serif italic text-[#1C1C1C]/60">
                Target: {campaign.audience}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#FF5F1F] block">
                Stage 02: Active Creative Campaign
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-[#1C1C1C] tracking-tight leading-tight">
                {campaign.campaignTitle}
              </h1>
            </div>

            <p className="text-sm sm:text-base font-serif italic text-[#FF5F1F]">
              &ldquo;{campaign.slogan}&rdquo;
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenExporter}
              className="flex items-center space-x-2 px-5 py-3 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white font-bold text-[11px] uppercase tracking-widest shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#FF5F1F] group-hover:text-white" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Psychological Impact & Memorability Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1C1C1C]/10">
          <div className="p-3.5 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 flex items-center space-x-3">
            <div className="p-2 rounded-sm bg-white border border-[#1C1C1C]/10 text-[#FF5F1F] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1C1C]/60 block">
                Memorability
              </span>
              <span className="text-xl font-serif font-bold text-[#1C1C1C]">
                {metrics.memorabilityScore}%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 flex items-center space-x-3">
            <div className="p-2 rounded-sm bg-white border border-[#1C1C1C]/10 text-[#FF5F1F] shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1C1C]/60 block">
                Resonance
              </span>
              <span className="text-xl font-serif font-bold text-[#1C1C1C]">
                {metrics.emotionalResonance}%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 flex items-center space-x-3">
            <div className="p-2 rounded-sm bg-white border border-[#1C1C1C]/10 text-[#1C1C1C] shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1C1C]/60 block">
                Clarity Index
              </span>
              <span className="text-xl font-serif font-bold text-[#1C1C1C]">
                {metrics.clarityScore}%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 flex items-center space-x-3">
            <div className="p-2 rounded-sm bg-white border border-[#1C1C1C]/10 text-emerald-600 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1C1C]/60 block">
                Safety Impact
              </span>
              <span className="text-xl font-serif font-bold text-[#1C1C1C]">
                {metrics.actionableImpact}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Navigation Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto p-1.5 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm pb-2 sm:pb-1.5">
        {[
          { id: "story", label: "Story Theater & Voice", icon: BookOpen },
          { id: "storyboard", label: "Visual Storyboard", icon: Film },
          { id: "toolbox", label: "Toolbox Talk & Pledge", icon: ShieldCheck },
          { id: "simulator", label: "Branching Scenario Sim", icon: Gamepad2 },
          { id: "posters", label: "Poster Studio", icon: Palette },
          { id: "multimedia", label: "Multi-Platform Media", icon: Clapperboard },
          { id: "quiz", label: "Mastery Quiz & Cert", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as StudioSubTab)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isCurrent
                  ? "bg-[#1C1C1C] text-white shadow-sm"
                  : "text-[#1C1C1C]/60 hover:text-[#1C1C1C] hover:bg-[#F0EFEC]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Studio Sub-View */}
      <div className="pt-2">
        {activeSubTab === "story" && <NarrativeView campaign={campaign} />}
        {activeSubTab === "storyboard" && (
          <StoryboardView campaign={campaign} onUpdateSceneImage={onUpdateSceneImage} />
        )}
        {activeSubTab === "toolbox" && <ToolboxTalkView campaign={campaign} />}
        {activeSubTab === "simulator" && <InteractiveSimView campaign={campaign} />}
        {activeSubTab === "posters" && <PosterStudioView campaign={campaign} />}
        {activeSubTab === "multimedia" && <MultimediaView campaign={campaign} />}
        {activeSubTab === "quiz" && <QuizView campaign={campaign} />}
      </div>
    </div>
  );
};
