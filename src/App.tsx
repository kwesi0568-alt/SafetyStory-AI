/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar, NavTab } from "./components/Navbar";
import { CampaignCreator } from "./components/CampaignCreator";
import { StudioView } from "./components/StudioView";
import { IdeaVault } from "./components/IdeaVault";
import { LibraryView } from "./components/LibraryView";
import { CampaignExporter } from "./components/CampaignExporter";
import { PRESET_CAMPAIGNS } from "./data/presets";
import { SafetyCampaign, CreateCampaignRequest, PresetTopic } from "./types";
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("creator");
  const [savedCampaigns, setSavedCampaigns] = useState<SafetyCampaign[]>(() => {
    try {
      const stored = localStorage.getItem("safetystory_campaigns");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed
            .map((item: any) => (item?.campaign ? item.campaign : item))
            .filter((item: any) => item && typeof item === "object" && item.campaignTitle);
          if (cleaned.length > 0) {
            return cleaned;
          }
        }
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return PRESET_CAMPAIGNS;
  });

  const [activeCampaign, setActiveCampaign] = useState<SafetyCampaign>(
    () => savedCampaigns[0] || PRESET_CAMPAIGNS[0]
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [exporterOpen, setExporterOpen] = useState(false);
  const [exportingCampaign, setExportingCampaign] = useState<SafetyCampaign | null>(null);
  const [prefilledIdea, setPrefilledIdea] = useState<string>("");
  const [prefilledIndustry, setPrefilledIndustry] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("safetystory_campaigns", JSON.stringify(savedCampaigns));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [savedCampaigns]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateCampaign = async (request: CreateCampaignRequest) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();
      const campaign: SafetyCampaign = data.campaign || data;

      if (!campaign || !campaign.narrative) {
        throw new Error("Invalid campaign response structure");
      }

      // Save to campaign list
      setSavedCampaigns((prev) => [campaign, ...prev.filter((c) => c.id !== campaign.id)]);
      setActiveCampaign(campaign);
      setCurrentTab("studio");

      if (data.mode === "error_fallback") {
        showToast("💡 High API traffic — Generated tailored campaign blueprint!");
      } else {
        showToast("✨ Campaign successfully created!");
      }
    } catch (err: any) {
      console.error("Failed to generate campaign", err);
      showToast("⚠️ Fallback campaign blueprint loaded.");
      // Fallback
      if (PRESET_CAMPAIGNS[0]) {
        setActiveCampaign(PRESET_CAMPAIGNS[0]);
        setCurrentTab("studio");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTopicFromVault = (topic: PresetTopic) => {
    setPrefilledIdea(`${topic.title}: ${topic.hazard}. Key rule: ${topic.coreRule}`);
    setPrefilledIndustry(topic.industry);
    setCurrentTab("creator");
  };

  const handleSelectCampaignFromLibrary = (campaign: SafetyCampaign) => {
    setActiveCampaign(campaign);
    setCurrentTab("studio");
  };

  const handleDeleteCampaign = (id: string) => {
    setSavedCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast("Campaign deleted from library.");
    if (activeCampaign.id === id && savedCampaigns.length > 1) {
      const remaining = savedCampaigns.filter((c) => c.id !== id);
      setActiveCampaign(remaining[0]);
    }
  };

  const handleOpenExporter = (campaign?: SafetyCampaign) => {
    setExportingCampaign(campaign || activeCampaign);
    setExporterOpen(true);
  };

  const handleUpdateSceneImage = (sceneNumber: number, imageUrl: string) => {
    setActiveCampaign((prev) => {
      const updatedStoryboard = prev.storyboard.map((s) =>
        s.sceneNumber === sceneNumber ? { ...s, imageUrl } : s
      );
      const updatedCampaign = { ...prev, storyboard: updatedStoryboard };
      setSavedCampaigns((all) =>
        all.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
      );
      return updatedCampaign;
    });
    showToast(`Scene #${sceneNumber} visual updated.`);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1C1C1C] flex flex-col font-sans selection:bg-[#FF5F1F] selection:text-white">
      {/* Top Fixed Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasActiveCampaign={Boolean(activeCampaign)}
        activeCampaignTitle={activeCampaign?.campaignTitle}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16 px-4 sm:px-6 max-w-7xl w-full mx-auto">
        {currentTab === "creator" && (
          <CampaignCreator
            onGenerate={handleGenerateCampaign}
            isGenerating={isGenerating}
            prefilledIdea={prefilledIdea}
            prefilledIndustry={prefilledIndustry}
          />
        )}

        {currentTab === "vault" && (
          <IdeaVault onSelectTopic={handleSelectTopicFromVault} />
        )}

        {currentTab === "library" && (
          <LibraryView
            campaigns={savedCampaigns}
            onSelectCampaign={handleSelectCampaignFromLibrary}
            onDeleteCampaign={handleDeleteCampaign}
            onExportCampaign={(camp) => handleOpenExporter(camp)}
          />
        )}

        {currentTab === "studio" && activeCampaign && (
          <StudioView
            campaign={activeCampaign}
            onOpenExporter={() => handleOpenExporter(activeCampaign)}
            onUpdateSceneImage={handleUpdateSceneImage}
          />
        )}
      </main>

      {/* Campaign Exporter Modal */}
      <CampaignExporter
        campaign={exportingCampaign}
        isOpen={exporterOpen}
        onClose={() => setExporterOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-sm bg-[#1C1C1C] text-white border border-[#1C1C1C]/30 text-[11px] font-bold uppercase tracking-wider shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-[#1C1C1C]/10 py-6 px-4 sm:px-8 max-w-7xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-[#1C1C1C]/50">
        <div>SafetyStory AI System &bull; Editorial Transformation Lab</div>
        <div>Precision Safety Storytelling &amp; Narrative Compliance</div>
        <div>&copy; 2026 Editorial Safety Intelligence</div>
      </footer>
    </div>
  );
}
