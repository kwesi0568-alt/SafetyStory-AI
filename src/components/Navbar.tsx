import React from "react";
import { Sparkles, ShieldAlert, BookOpen, PlusCircle, Download, Film } from "lucide-react";
import { SafetyCampaign } from "../types";

export type NavTab = "creator" | "studio" | "vault" | "library";

export interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeCampaign?: SafetyCampaign | null;
  onExportAll?: () => void;
  hasActiveCampaign?: boolean;
  activeCampaignTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeCampaign,
  onExportAll,
  hasActiveCampaign,
  activeCampaignTitle,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#1C1C1C]/10 text-[#1C1C1C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            id="brand-logo-btn"
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onSelectTab("creator")}
          >
            <div className="w-10 h-10 bg-[#FF5F1F] rounded-full flex items-center justify-center text-white font-serif font-bold text-xl italic shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tighter uppercase font-editorial-sans text-[#1C1C1C]">
                  SafetyStory <span className="text-[#FF5F1F]">AI</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-[#1C1C1C] text-white">
                  Editorial Lab
                </span>
              </div>
              <p className="text-[11px] text-[#1C1C1C]/60 font-serif italic hidden sm:block">
                One safety idea. An entire creative campaign.
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-creator-btn"
              onClick={() => onSelectTab("creator")}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm ${
                currentTab === "creator"
                  ? "bg-[#1C1C1C] text-white shadow-sm"
                  : "text-[#1C1C1C]/60 hover:text-[#1C1C1C] hover:bg-[#F0EFEC]"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Workspace</span>
              <span className="md:hidden">Create</span>
            </button>

            <button
              id="nav-studio-btn"
              onClick={() => onSelectTab("studio")}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm ${
                currentTab === "studio"
                  ? "bg-[#1C1C1C] text-white shadow-sm"
                  : "text-[#1C1C1C]/60 hover:text-[#1C1C1C] hover:bg-[#F0EFEC]"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Studio</span>
              {(activeCampaign || hasActiveCampaign) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] animate-pulse" />
              )}
            </button>

            <button
              id="nav-vault-btn"
              onClick={() => onSelectTab("vault")}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm ${
                currentTab === "vault"
                  ? "bg-[#1C1C1C] text-white shadow-sm"
                  : "text-[#1C1C1C]/60 hover:text-[#1C1C1C] hover:bg-[#F0EFEC]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span className="hidden md:inline">Idea Vault</span>
              <span className="md:hidden">Vault</span>
            </button>

            <button
              id="nav-library-btn"
              onClick={() => onSelectTab("library")}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm ${
                currentTab === "library"
                  ? "bg-[#1C1C1C] text-white shadow-sm"
                  : "text-[#1C1C1C]/60 hover:text-[#1C1C1C] hover:bg-[#F0EFEC]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Archive</span>
              <span className="md:hidden">Archive</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {onExportAll && (
              <button
                id="header-export-btn"
                onClick={onExportAll}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-sm bg-white hover:bg-[#F5F2ED] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-widest border border-[#1C1C1C]/10 shadow-sm transition"
                title="Export Complete Campaign Dossier"
              >
                <Download className="w-3.5 h-3.5 text-[#FF5F1F]" />
                <span>Export Dossier</span>
              </button>
            )}

            <div
              className="hidden sm:flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm border border-[#1C1C1C]/10 bg-[#F5F2ED] text-[#1C1C1C]"
              title="Editorial Intelligence Engine Online"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF5F1F] animate-pulse" />
              <span>Gemini 3.7 Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

