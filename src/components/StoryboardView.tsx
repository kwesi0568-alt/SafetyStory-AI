import React, { useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
  MessageSquare,
  Eye,
  Film,
  Zap,
} from "lucide-react";
import { StoryboardScene, SafetyCampaign } from "../types";

interface StoryboardViewProps {
  campaign: SafetyCampaign;
  onUpdateSceneImage?: (sceneNumber: number, imageUrl: string) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  campaign,
  onUpdateSceneImage,
}) => {
  const [scenes, setScenes] = useState<StoryboardScene[]>(campaign.storyboard || []);
  const [generatingScene, setGeneratingScene] = useState<number | null>(null);
  const [fullscreenSceneIndex, setFullscreenSceneIndex] = useState<number | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [visualTheme, setVisualTheme] = useState<"cinematic" | "graphic" | "blueprint">("cinematic");

  const handleGenerateImage = async (sceneNumber: number, prompt: string) => {
    setGeneratingScene(sceneNumber);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio: "16:9" }),
      });
      const data = await res.json();
      const finalUrl = data.imageUrl || data.fallbackUrl;

      if (finalUrl) {
        setScenes((prev) =>
          prev.map((s) => (s.sceneNumber === sceneNumber ? { ...s, imageUrl: finalUrl } : s))
        );
        if (onUpdateSceneImage) {
          onUpdateSceneImage(sceneNumber, finalUrl);
        }
      }
    } catch (err) {
      console.error("Image generation failed", err);
      // Fallback
      const fallback = `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 12))}/800/450`;
      setScenes((prev) =>
        prev.map((s) => (s.sceneNumber === sceneNumber ? { ...s, imageUrl: fallback } : s))
      );
    } finally {
      setGeneratingScene(null);
    }
  };

  const handleCopyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptIndex(idx);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  // Render stylized SVG visual card when image is not yet generated
  const renderVisualMockup = (scene: StoryboardScene) => {
    if (scene.imageUrl) {
      return (
        <img
          src={scene.imageUrl}
          alt={scene.caption}
          referrerPolicy="no-referrer"
          className="w-full h-48 sm:h-56 object-cover rounded-sm border border-[#1C1C1C]/10 shadow-sm group-hover:scale-[1.01] transition-transform duration-500"
        />
      );
    }

    return (
      <div
        className="w-full h-48 sm:h-56 rounded-sm bg-[#F5F2ED] border border-[#1C1C1C]/10 p-5 flex flex-col justify-between relative overflow-hidden shadow-inner group"
      >
        {/* Subtle grid framing lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C1C1C08_1px,transparent_1px),linear-gradient(to_bottom,#1C1C1C08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-sm bg-white border border-[#1C1C1C]/10 text-[10px] uppercase font-bold tracking-wider text-[#FF5F1F]">
            <Camera className="w-3 h-3" />
            <span>{scene.cameraAngle || "Cinematic Wide"}</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1C]/60">SCENE #{scene.sceneNumber}</span>
        </div>

        <div className="relative z-10 text-center px-4">
          <p className="text-xs text-[#1C1C1C] font-serif italic line-clamp-3 leading-relaxed">
            &ldquo;{scene.visualDescription}&rdquo;
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#1C1C1C]/10">
          <span className="text-[10px] text-[#1C1C1C]/60 font-bold uppercase tracking-widest">
            {campaign.topic.split(" ")[0]} Frame
          </span>
          <button
            onClick={() => handleGenerateImage(scene.sceneNumber, scene.prompt)}
            disabled={generatingScene === scene.sceneNumber}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#FF5F1F] group-hover:text-white" />
            <span>{generatingScene === scene.sceneNumber ? "Rendering..." : "Render AI Visual"}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>5-Scene Visual Storyboard &bull; Frame Director</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1C1C1C]">
            {campaign.narrative.title || campaign.campaignTitle}
          </h2>
          <p className="text-xs text-[#1C1C1C]/60 font-serif italic mt-0.5">
            Cinematic scene-by-scene framing ready for toolbox presentations, video production, and site posters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFullscreenSceneIndex(0)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-sm bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white text-xs font-bold uppercase tracking-widest shadow-sm transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Crew Slideshow Mode</span>
          </button>
        </div>
      </div>

      {/* Storyboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((scene, idx) => (
          <div
            key={scene.sceneNumber}
            className="bg-white rounded-sm border border-[#1C1C1C]/10 p-5 shadow-sm flex flex-col justify-between hover:border-[#1C1C1C]/30 transition group space-y-4"
          >
            {/* Visual Canvas / Image */}
            <div className="relative">
              {renderVisualMockup(scene)}
              {scene.imageUrl && (
                <button
                  onClick={() => setFullscreenSceneIndex(idx)}
                  className="absolute bottom-3 right-3 p-2 rounded-sm bg-[#1C1C1C]/90 hover:bg-[#FF5F1F] text-white border border-white/20 shadow-md text-xs cursor-pointer"
                  title="View Fullscreen"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Scene Details */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#1C1C1C]/5 pb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">
                  Scene {scene.sceneNumber}: {scene.caption}
                </span>
                <span className="text-[10px] text-[#1C1C1C]/60 bg-[#F5F2ED] px-2 py-0.5 rounded-sm border border-[#1C1C1C]/10 font-bold uppercase tracking-wider">
                  {scene.cameraAngle} {scene.duration ? `• ${scene.duration}` : ""}
                </span>
              </div>

              {/* Action & Visual Description */}
              <p className="text-xs text-[#1C1C1C]/90 leading-relaxed font-serif">
                {scene.action || scene.visualDescription}
              </p>

              {/* Dialogue / VO Bubble */}
              {(scene.dialogue || scene.voiceover) && (
                <div className="p-2.5 rounded-sm bg-[#F9F8F6] border-l-2 border-[#FF5F1F] flex items-start space-x-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FF5F1F] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1C1C1C] font-serif italic leading-relaxed">
                    <strong>VO / Dialogue:</strong> &ldquo;{scene.dialogue || scene.voiceover}&rdquo;
                  </p>
                </div>
              )}

              {/* Sound & Music Direction */}
              {scene.soundMusicDirection && (
                <div className="text-[11px] text-[#1C1C1C]/70 italic flex items-center space-x-1.5 bg-[#F5F2ED] px-2.5 py-1 rounded-sm">
                  <span>🎵</span>
                  <span className="truncate"><strong>Audio:</strong> {scene.soundMusicDirection}</span>
                </div>
              )}

              {/* Safety Message Anchor */}
              {scene.safetyMessage && (
                <div className="text-[11px] text-emerald-800 bg-[#F0FDF4] border border-emerald-200 px-2.5 py-1 rounded-sm flex items-center space-x-1.5">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate"><strong>Core Rule:</strong> {scene.safetyMessage}</span>
                </div>
              )}
            </div>

            {/* Prompt & Video Prompt Exporter */}
            <div className="pt-2.5 border-t border-[#1C1C1C]/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#1C1C1C]/50 truncate max-w-[160px]" title={scene.prompt}>
                  Image: {scene.prompt}
                </span>
                <button
                  onClick={() => handleCopyPrompt(scene.prompt, idx)}
                  className="flex items-center space-x-1 text-[10px] text-[#1C1C1C]/70 hover:text-[#FF5F1F] font-bold uppercase tracking-wider cursor-pointer"
                >
                  {copiedPromptIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPromptIndex === idx ? "Copied" : "Copy Image Prompt"}</span>
                </button>
              </div>

              {scene.videoPrompt && (
                <div className="flex items-center justify-between text-xs bg-[#F5F2ED] p-1.5 rounded-sm">
                  <span className="text-[10px] text-[#1C1C1C]/70 truncate max-w-[160px]" title={scene.videoPrompt}>
                    🎬 Video AI Prompt
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(scene.videoPrompt || "", idx + 100)}
                    className="flex items-center space-x-1 text-[10px] text-[#FF5F1F] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {copiedPromptIndex === idx + 100 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPromptIndex === idx + 100 ? "Copied" : "Copy Video Prompt"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Crew Slideshow Modal */}
      {fullscreenSceneIndex !== null && (
        <div className="fixed inset-0 z-50 bg-[#1C1C1C]/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-sm bg-[#FF5F1F] text-white font-bold text-xs uppercase tracking-widest">
                Scene {fullscreenSceneIndex + 1} of {scenes.length}
              </span>
              <h3 className="text-lg font-serif italic text-white">
                {scenes[fullscreenSceneIndex].caption}
              </h3>
            </div>
            <button
              onClick={() => setFullscreenSceneIndex(null)}
              className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Center Stage Presentation Card */}
          <div className="max-w-4xl mx-auto w-full my-auto space-y-6">
            {scenes[fullscreenSceneIndex].imageUrl ? (
              <img
                src={scenes[fullscreenSceneIndex].imageUrl}
                alt={scenes[fullscreenSceneIndex].caption}
                referrerPolicy="no-referrer"
                className="w-full max-h-[50vh] object-contain rounded-sm border border-white/20 shadow-2xl mx-auto"
              />
            ) : (
              <div className="w-full h-80 rounded-sm bg-[#2A2A2A] border border-white/10 flex items-center justify-center p-8 text-center">
                <p className="text-lg text-white font-serif italic max-w-xl">
                  &ldquo;{scenes[fullscreenSceneIndex].visualDescription}&rdquo;
                </p>
              </div>
            )}

            <div className="p-6 rounded-sm bg-[#2A2A2A] border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-[#FF5F1F] font-bold text-xs uppercase tracking-wider">
                <Camera className="w-4 h-4" />
                <span>Angle: {scenes[fullscreenSceneIndex].cameraAngle}</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-serif">
                {scenes[fullscreenSceneIndex].visualDescription}
              </p>
              {scenes[fullscreenSceneIndex].dialogue && (
                <p className="text-sm font-serif italic text-[#FF5F1F] border-l-2 border-[#FF5F1F] pl-3">
                  {scenes[fullscreenSceneIndex].dialogue}
                </p>
              )}
            </div>
          </div>

          {/* Carousel Navigation Bottom Controls */}
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full pt-4 border-t border-white/10">
            <button
              onClick={() =>
                setFullscreenSceneIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : scenes.length - 1
                )
              }
              className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {scenes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFullscreenSceneIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    fullscreenSceneIndex === i ? "bg-[#FF5F1F] w-6" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setFullscreenSceneIndex((prev) =>
                  prev !== null && prev < scenes.length - 1 ? prev + 1 : 0
                )
              }
              className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-[#FF5F1F] hover:bg-[#E04E13] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
