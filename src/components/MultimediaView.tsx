import React, { useState } from "react";
import {
  Video,
  Radio,
  Share2,
  Copy,
  Check,
  Clapperboard,
  Sparkles,
  Smartphone,
  Tv,
  MessageSquare,
  Instagram,
  Layers,
} from "lucide-react";
import { SafetyCampaign } from "../types";

interface MultimediaViewProps {
  campaign: SafetyCampaign;
}

export const MultimediaView: React.FC<MultimediaViewProps> = ({ campaign }) => {
  const { multimediaConcepts, campaignTitle, slogan } = campaign;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"video" | "audio" | "social">("video");

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const video = multimediaConcepts?.videoScript;
  const audioDrama = multimediaConcepts?.audioDrama;
  const social = multimediaConcepts?.socialMicroContent;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Tab Selector */}
      <div className="flex items-center justify-center space-x-2 p-1.5 rounded-sm bg-[#EAE7E1] border border-[#1C1C1C]/10 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "video"
              ? "bg-[#1C1C1C] text-white shadow-sm"
              : "text-[#1C1C1C]/60 hover:text-[#1C1C1C]"
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5" />
          <span>60s Film Script</span>
        </button>

        <button
          onClick={() => setActiveTab("audio")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "audio"
              ? "bg-[#1C1C1C] text-white shadow-sm"
              : "text-[#1C1C1C]/60 hover:text-[#1C1C1C]"
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Audio Drama</span>
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "social"
              ? "bg-[#1C1C1C] text-white shadow-sm"
              : "text-[#1C1C1C]/60 hover:text-[#1C1C1C]"
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Micro Channels</span>
        </button>
      </div>

      {/* 1. 60s Video Micro-Film Script View */}
      {activeTab === "video" && (
        <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1">
                <Video className="w-3.5 h-3.5" />
                <span>Micro-Film Production Blueprint &bull; 60 Seconds</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
                {video?.title || `${campaignTitle}: The Film`}
              </h3>
            </div>

            <button
              onClick={() =>
                handleCopy(
                  `60s VIDEO SCRIPT: ${video?.title}\nDirector Notes: ${video?.directorNotes}\n\n${video?.scenes
                    .map((s) => `[${s.time}]\nVisual: ${s.visual}\nAudio: ${s.audio}`)
                    .join("\n\n")}`,
                  "video-script"
                )
              }
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 self-start transition cursor-pointer"
            >
              {copiedKey === "video-script" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "video-script" ? "Copied Script" : "Copy Script"}</span>
            </button>
          </div>

          {/* Director's Notes */}
          <div className="p-5 rounded-sm bg-[#FFF9F5] border-l-4 border-[#FF5F1F] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] block">
              Director&apos;s Aesthetic & Sound Vision
            </span>
            <p className="text-xs sm:text-sm text-[#1C1C1C] leading-relaxed font-serif italic">
              {video?.directorNotes}
            </p>
          </div>

          {/* Scene Visual & Audio Table */}
          <div className="space-y-3">
            {video?.scenes.map((sc, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 grid grid-cols-1 md:grid-cols-12 gap-4 hover:border-[#1C1C1C]/30 transition"
              >
                <div className="md:col-span-2 flex md:flex-col items-center md:items-start space-x-2 md:space-x-0">
                  <span className="px-2.5 py-1 rounded-sm bg-[#1C1C1C] text-white text-[11px] font-serif font-bold italic">
                    {sc.time}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1C1C]/60 mt-1">
                    Shot {i + 1}
                  </span>
                </div>

                <div className="md:col-span-5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1C1C]/60 block">
                    Visual Cue & Action
                  </span>
                  <p className="text-xs sm:text-sm text-[#1C1C1C] font-serif leading-relaxed">
                    {sc.visual}
                  </p>
                </div>

                <div className="md:col-span-5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF5F1F] block">
                    Audio / Voiceover / SFX
                  </span>
                  <p className="text-xs sm:text-sm text-[#1C1C1C]/85 font-serif italic leading-relaxed">
                    {sc.audio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Audio Drama Script View */}
      {activeTab === "audio" && (
        <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1">
                <Radio className="w-3.5 h-3.5" />
                <span>Binaural Audio Drama & Radio Broadcast Spot</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
                {audioDrama?.title || "Shift Incident Radio"}
              </h3>
              <p className="text-xs text-[#1C1C1C]/60 font-serif italic mt-0.5">
                Format: {audioDrama?.format || "3-Minute Radio Experience"}
              </p>
            </div>

            <button
              onClick={() => handleCopy(audioDrama?.dialogueSnippet || "", "audio-drama")}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 self-start transition cursor-pointer"
            >
              {copiedKey === "audio-drama" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "audio-drama" ? "Copied" : "Copy Dialogue"}</span>
            </button>
          </div>

          {/* Voice Cast */}
          {audioDrama?.characters && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#1C1C1C]/60 uppercase tracking-widest">
                Cast Characters:
              </span>
              <div className="flex flex-wrap gap-2">
                {audioDrama.characters.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 text-[#1C1C1C] text-xs font-serif italic"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Script Content */}
          <div className="p-6 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 font-mono text-xs sm:text-sm text-[#1C1C1C] leading-relaxed whitespace-pre-wrap">
            {audioDrama?.dialogueSnippet}
          </div>
        </div>
      )}

      {/* 3. Multi-Platform Micro Content View */}
      {activeTab === "social" && (
        <div className="space-y-6">
          {/* Slack / Teams Daily Safety Tip */}
          <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Slack / Microsoft Teams Daily Safety Pulse</span>
              </div>
              <button
                onClick={() => handleCopy(social?.slackTeamsTip || "", "slack-tip")}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
              >
                {copiedKey === "slack-tip" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "slack-tip" ? "Copied" : "Copy to Slack"}</span>
              </button>
            </div>
            <div className="p-4 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 text-xs sm:text-sm text-[#1C1C1C] font-serif leading-relaxed">
              {social?.slackTeamsTip}
            </div>
          </div>

          {/* Instagram / LinkedIn Carousel Cards */}
          <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F]">
                <Instagram className="w-3.5 h-3.5" />
                <span>4-Slide Social Carousel Series (Instagram / LinkedIn)</span>
              </div>
              <button
                onClick={() => handleCopy(social?.instagramCarousel?.join("\n\n") || "", "carousel")}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
              >
                {copiedKey === "carousel" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "carousel" ? "Copied" : "Copy Slides"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {social?.instagramCarousel?.map((slide, i) => (
                <div
                  key={i}
                  className="p-5 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 space-y-3 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono font-bold text-[#FF5F1F] tracking-wider">
                    SLIDE {i + 1}
                  </span>
                  <p className="text-xs text-[#1C1C1C] font-serif leading-relaxed">
                    {slide}
                  </p>
                  <span className="text-[9px] text-[#1C1C1C]/40 uppercase tracking-widest">
                    SafetyStory AI &bull; Protocol
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Signage Loop */}
          <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F]">
                <Tv className="w-3.5 h-3.5" />
                <span>Digital Signage & Breakroom Display Ticker</span>
              </div>
              <button
                onClick={() => handleCopy(social?.digitalSignageLoop || "", "signage")}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
              >
                {copiedKey === "signage" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "signage" ? "Copied" : "Copy Ticker"}</span>
              </button>
            </div>
            <div className="p-4 rounded-sm bg-[#1C1C1C] text-white text-xs sm:text-sm font-mono tracking-wide leading-relaxed">
              {social?.digitalSignageLoop}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
