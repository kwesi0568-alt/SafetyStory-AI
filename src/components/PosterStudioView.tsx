import React, { useState, useRef } from "react";
import {
  Sparkles,
  Download,
  Printer,
  Sliders,
  Palette,
  Type,
  Shield,
  AlertTriangle,
  Zap,
  HardHat,
  Flame,
  Eye,
  Lock,
  RotateCcw,
} from "lucide-react";
import { SafetyCampaign } from "../types";

interface PosterStudioViewProps {
  campaign: SafetyCampaign;
}

type PaletteType = "yellow" | "orange" | "red" | "green" | "cyan" | "dark";
type StyleType = "industrial" | "swiss" | "comic" | "blueprint";

export const PosterStudioView: React.FC<PosterStudioViewProps> = ({ campaign }) => {
  const posterConcept = campaign.multimediaConcepts?.posterConcept;

  const [headline, setHeadline] = useState(posterConcept?.headline || "YOUR HARNESS IS NOT A BURDEN. IT IS YOUR LIFE.");
  const [subheadline, setSubheadline] = useState(posterConcept?.subheadline || campaign.slogan || "100% Tie-Off. Zero Compromise.");
  const [callToAction, setCallToAction] = useState(posterConcept?.callToAction || "Inspect before use. Connect with intention. Protect every step.");
  const [selectedPalette, setSelectedPalette] = useState<PaletteType>("yellow");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("industrial");
  const [selectedIcon, setSelectedIcon] = useState<"shield" | "alert" | "zap" | "hardhat" | "flame" | "lock">("shield");

  const posterRef = useRef<HTMLDivElement>(null);

  const getPaletteClasses = () => {
    switch (selectedPalette) {
      case "yellow":
        return {
          bg: "bg-amber-400 text-slate-950",
          accentBg: "bg-slate-950 text-amber-400",
          border: "border-slate-950",
          badge: "bg-slate-950 text-amber-300",
          stripes: "bg-stripes-yellow",
        };
      case "orange":
        return {
          bg: "bg-orange-500 text-white",
          accentBg: "bg-slate-950 text-orange-400",
          border: "border-slate-950",
          badge: "bg-slate-950 text-orange-300",
          stripes: "bg-stripes-orange",
        };
      case "red":
        return {
          bg: "bg-rose-600 text-white",
          accentBg: "bg-slate-950 text-rose-400",
          border: "border-slate-950",
          badge: "bg-slate-950 text-rose-300",
          stripes: "bg-stripes-red",
        };
      case "green":
        return {
          bg: "bg-emerald-600 text-white",
          accentBg: "bg-slate-950 text-emerald-300",
          border: "border-slate-950",
          badge: "bg-slate-950 text-emerald-300",
          stripes: "bg-stripes-green",
        };
      case "cyan":
        return {
          bg: "bg-cyan-600 text-white",
          accentBg: "bg-slate-950 text-cyan-300",
          border: "border-slate-950",
          badge: "bg-slate-950 text-cyan-300",
          stripes: "bg-stripes-cyan",
        };
      case "dark":
      default:
        return {
          bg: "bg-slate-950 text-slate-100",
          accentBg: "bg-amber-500 text-slate-950",
          border: "border-slate-800",
          badge: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
          stripes: "bg-stripes-dark",
        };
    }
  };

  const palette = getPaletteClasses();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    if (!posterRef.current) return;
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
  <rect width="800" height="1100" fill="${selectedPalette === "yellow" ? "#FBBF24" : selectedPalette === "orange" ? "#F97316" : selectedPalette === "red" ? "#E11D48" : "#0F172A"}" />
  <rect x="30" y="30" width="740" height="1040" fill="none" stroke="#000000" stroke-width="12" />
  <text x="400" y="140" font-family="sans-serif" font-size="24" font-weight="900" text-anchor="middle" fill="#000000" letter-spacing="4">SAFETYSTORY AI • ZERO COMPROMISE</text>
  <line x1="50" y1="170" x2="750" y2="170" stroke="#000000" stroke-width="4" />
  <text x="400" y="320" font-family="sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="#000000">
    <tspan x="400" dy="0">${headline.slice(0, 30)}</tspan>
    <tspan x="400" dy="55">${headline.slice(30, 65)}</tspan>
  </text>
  <rect x="80" y="470" width="640" height="120" fill="#000000" rx="16" />
  <text x="400" y="540" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#FFFFFF">${subheadline}</text>
  <text x="400" y="740" font-family="sans-serif" font-size="22" text-anchor="middle" fill="#000000">${callToAction}</text>
  <text x="400" y="980" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#000000">CAMPAIGN: ${campaign.campaignTitle}</text>
</svg>
`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Safety_Poster_${campaign.id}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Interactive Visual Studio &bull; Site Poster Architect</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
            Customizable Site Poster Designer
          </h2>
          <p className="text-xs text-[#1C1C1C]/60 font-serif italic mt-0.5">
            Instant high-impact visual layouts ready for shopfloor boards, job trailers, and safety kiosks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadSVG}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-sm bg-white hover:bg-[#F0EFEC] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Download SVG</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white text-[11px] font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Poster</span>
          </button>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Live Controls */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-sm border border-[#1C1C1C]/10 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C] flex items-center space-x-2 border-b border-[#1C1C1C]/10 pb-3">
            <Sliders className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Visual Composition Controls</span>
          </h3>

          {/* Color Palette Selector */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#1C1C1C]/60 block mb-2">
              Color Palette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "yellow", label: "Hazard Gold", color: "bg-amber-400 text-slate-950" },
                { id: "orange", label: "Signal Orange", color: "bg-[#FF5F1F] text-white" },
                { id: "red", label: "Critical Red", color: "bg-rose-600 text-white" },
                { id: "green", label: "Safe Green", color: "bg-emerald-600 text-white" },
                { id: "cyan", label: "Tech Slate", color: "bg-cyan-700 text-white" },
                { id: "dark", label: "Monochrome Carbon", color: "bg-[#1C1C1C] text-[#FF5F1F] border border-black" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPalette(p.id as PaletteType)}
                  className={`px-2.5 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1.5 cursor-pointer ${p.color} ${
                    selectedPalette === p.id ? "ring-2 ring-[#1C1C1C] scale-105 shadow-md" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Design Style */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#1C1C1C]/60 block mb-2">
              Typography & Layout Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "industrial", label: "Bold Industrial" },
                { id: "swiss", label: "Swiss Editorial Minimal" },
                { id: "comic", label: "Narrative Pop-Art" },
                { id: "blueprint", label: "Technical Blueprint" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id as StyleType)}
                  className={`p-2.5 rounded-sm text-xs font-semibold border text-left transition cursor-pointer ${
                    selectedStyle === s.id
                      ? "bg-[#FFF9F5] border-[#FF5F1F] text-[#FF5F1F] font-bold"
                      : "bg-[#F9F8F6] border-[#1C1C1C]/10 text-[#1C1C1C] hover:text-black"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#1C1C1C]/60 block mb-2">
              Symbol & Directive Icon
            </label>
            <div className="flex space-x-2">
              {[
                { id: "shield", icon: Shield },
                { id: "alert", icon: AlertTriangle },
                { id: "zap", icon: Zap },
                { id: "hardhat", icon: HardHat },
                { id: "flame", icon: Flame },
                { id: "lock", icon: Lock },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIcon(item.id as any)}
                    className={`p-2.5 rounded-sm border transition cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1C1C] text-[#FF5F1F] border-[#1C1C1C]"
                        : "bg-[#F9F8F6] border-[#1C1C1C]/10 text-[#1C1C1C]/60 hover:text-[#1C1C1C]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1C1C1C]/60 block mb-1">
                Main Headline
              </label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/10 rounded-sm p-2.5 text-xs text-[#1C1C1C] font-serif focus:border-[#FF5F1F] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1C1C1C]/60 block mb-1">
                Subheadline / Slogan
              </label>
              <input
                type="text"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/10 rounded-sm p-2 text-xs text-[#1C1C1C] font-serif focus:border-[#FF5F1F] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1C1C1C]/60 block mb-1">
                Directive Action Prompt
              </label>
              <textarea
                rows={2}
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/10 rounded-sm p-2.5 text-xs text-[#1C1C1C] font-serif focus:border-[#FF5F1F] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Live Poster Canvas */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={posterRef}
            className={`w-full max-w-md aspect-[3/4] rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden border-8 ${palette.border} ${palette.bg}`}
          >
            {/* Top Hazard Bar */}
            <div className="flex items-center justify-between border-b-2 border-current pb-3">
              <div className="flex items-center space-x-2 font-bold uppercase text-xs tracking-widest font-serif">
                {selectedIcon === "shield" && <Shield className="w-4 h-4 fill-current" />}
                {selectedIcon === "alert" && <AlertTriangle className="w-4 h-4 fill-current" />}
                {selectedIcon === "zap" && <Zap className="w-4 h-4 fill-current" />}
                {selectedIcon === "hardhat" && <HardHat className="w-4 h-4 fill-current" />}
                {selectedIcon === "flame" && <Flame className="w-4 h-4 fill-current" />}
                {selectedIcon === "lock" && <Lock className="w-4 h-4 fill-current" />}
                <span>SAFETY DIRECTIVE</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm bg-black/20">
                ZERO COMPROMISE
              </span>
            </div>

            {/* Poster Main Body */}
            <div className="my-auto space-y-5 text-center">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-tight leading-tight">
                {headline}
              </h1>

              {/* Slogan Banner Block */}
              <div className={`p-3 sm:p-4 rounded-sm font-serif font-bold uppercase tracking-wide text-xs sm:text-sm shadow-md ${palette.accentBg}`}>
                &ldquo;{subheadline}&rdquo;
              </div>

              <p className="text-xs sm:text-sm font-serif italic leading-relaxed px-2 opacity-90">
                {callToAction}
              </p>
            </div>

            {/* Bottom Footer Stamp */}
            <div className="pt-3 border-t border-current/30 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest opacity-80">
              <span>{campaign.industry}</span>
              <span>SafetyStory AI &bull; Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
