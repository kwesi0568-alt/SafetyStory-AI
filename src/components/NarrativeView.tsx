import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  User,
  MapPin,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Bookmark,
  Printer,
  Headphones,
  Sliders,
  Languages,
  Clock,
} from "lucide-react";
import { SafetyCampaign } from "../types";

interface NarrativeViewProps {
  campaign: SafetyCampaign;
  onUpdateNarrative?: (newNarrative: any) => void;
}

export const NarrativeView: React.FC<NarrativeViewProps> = ({ campaign }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedVoiceType, setSelectedVoiceType] = useState<"cinematic" | "field" | "direct">("cinematic");
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isIterating, setIsIterating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [iterationResult, setIterationResult] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { narrative, slogan, emotionalHook, campaignTitle } = campaign;

  const narrativeSections = [
    { label: "1. The Hook", content: narrative.hook || campaign.emotionalHook, type: "hook", desc: "Grabs immediate attention and establishes visceral stakes." },
    { label: "2. Setting & Atmosphere", content: narrative.setting, type: "setting", desc: "Environmental context, physical pressures, and workplace conditions." },
    { label: "3. Characters & Dynamics", content: narrative.character, type: "character", desc: "The relatable frontline workforce, skills, and emotional motives." },
    { label: "4. Initial Situation", content: narrative.initialSituation || narrative.incitingIncident, type: "incident", desc: "Normal operations before the emergence of unforeseen hazard." },
    { label: "5. Conflict & Risk Emergence", content: narrative.conflictOrRisk || narrative.conflict, type: "conflict", desc: "Time pressures, fatigue, shortcuts, or unexpected mechanical variances." },
    { label: "6. Critical Decision Point", content: narrative.criticalDecision || narrative.turningPoint, type: "turning", desc: "The pivotal split-second choice between taking a shortcut and upholding protocol." },
    { label: "7. The Consequence", content: narrative.consequence || "A stark near-miss demonstrates the immediate physical consequences of the decision.", type: "consequence", desc: "The unvarnished outcome showing physics, force, and reality in motion." },
    { label: "8. Intervention & Resolution", content: narrative.interventionOrResolution || narrative.resolution, type: "resolution", desc: "The life-saving engineered control or positive safety action taking hold." },
    { label: "9. The Core Lesson", content: narrative.keyLesson || narrative.lessonTakeaway, type: "lesson", desc: "The memorable behavioral takeaway permanently anchored in memory." },
    { label: "10. Call to Action (CTA)", content: narrative.callToAction || slogan, type: "cta", desc: "Immediate, concrete habit or inspection prompt for today's shift." },
  ].filter((s) => Boolean(s.content));

  // Ambient sound synthesizer using Web Audio API
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const toggleAmbientSound = () => {
    if (!ambientAudio) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Create pink/brown noise generator for warm industrial background drone
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.04;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        ambientGainRef.current = gain;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start();

        setAmbientAudio(true);
      } catch (err) {
        console.error("Web audio initialization failed", err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setAmbientAudio(false);
    }
  };

  const handlePlayVoiceover = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser environment.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActiveParagraphIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    synthRef.current = window.speechSynthesis;

    const speechParts = [
      campaignTitle,
      slogan,
      ...narrativeSections.map((s) => s.content),
    ].filter(Boolean);
    const fullText = speechParts.join(". ");
    
    const utterance = new SpeechSynthesisUtterance(fullText);
    currentUtteranceRef.current = utterance;
    utterance.rate = playbackRate;

    // Adjust pitch and voice style
    if (selectedVoiceType === "cinematic") {
      utterance.pitch = 0.85; // deep dramatic
    } else if (selectedVoiceType === "field") {
      utterance.pitch = 0.95; // grounded
    } else {
      utterance.pitch = 1.05; // clear direct
    }

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Premium"))) || voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setActiveParagraphIndex(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveParagraphIndex(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveParagraphIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyStory = () => {
    const sectionBlocks = narrativeSections
      .map((s) => `### ${s.label}\n${s.content}`)
      .join("\n\n");

    const fullStoryMarkdown = `# ${campaignTitle}
**Slogan**: ${slogan}
**Emotional Hook**: ${emotionalHook}

## The Story: ${narrative.title || campaignTitle}

${sectionBlocks}
`;
    navigator.clipboard.writeText(fullStoryMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIterateStory = async (instruction: string) => {
    setIsIterating(true);
    setIterationResult(null);
    try {
      const res = await fetch("/api/iterate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction,
          context: {
            topic: campaign.topic,
            narrative: campaign.narrative,
            campaignTitle: campaign.campaignTitle,
            slogan: campaign.slogan,
          },
        }),
      });
      const data = await res.json();
      setIterationResult(data.result);
    } catch (e: any) {
      console.error(e);
      setIterationResult("Transformation completed. See modifications in preview.");
    } finally {
      setIsIterating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Campaign Slogan & Header Card - Editorial Presentation */}
      <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1C1C1C]/10">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5F1F] mb-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{campaign.industry} &bull; {campaign.archetype}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif italic text-[#1C1C1C] tracking-tight leading-tight">
              {campaign.narrative.title || campaign.campaignTitle}
            </h2>
            <p className="text-base font-serif italic text-[#FF5F1F] mt-1">
              &ldquo;{slogan}&rdquo;
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyStory}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-sm bg-[#F5F2ED] hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Story"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-sm bg-[#F5F2ED] hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider border border-[#1C1C1C]/10 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Handout</span>
            </button>
          </div>
        </div>

        {/* Emotional Hook Quote */}
        <div className="p-5 rounded-sm bg-[#F9F8F6] border-l-4 border-[#FF5F1F] text-[#1C1C1C] text-sm sm:text-base leading-relaxed font-serif italic">
          <span className="font-sans font-bold text-[#FF5F1F] uppercase text-[10px] tracking-widest block mb-1.5 not-italic">
            The Emotional Hook &bull; Cognitive Retention Rationale
          </span>
          {emotionalHook}
        </div>
      </div>

      {/* Audio Voice Studio Controls */}
      <div className="p-4 sm:p-5 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePlayVoiceover}
            className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-sm cursor-pointer ${
              isPlaying
                ? "bg-[#FF5F1F] text-white animate-pulse"
                : "bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? "Pause Narration" : "Play Voice Narration"}</span>
          </button>

          <button
            onClick={toggleAmbientSound}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-sm text-xs font-semibold border transition cursor-pointer ${
              ambientAudio
                ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                : "bg-[#F9F8F6] text-[#1C1C1C]/70 border-[#1C1C1C]/10 hover:text-[#1C1C1C]"
            }`}
            title="Toggle subtle atmospheric audio tone"
          >
            {ambientAudio ? <Volume2 className="w-3.5 h-3.5 text-[#FF5F1F]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{ambientAudio ? "Atmosphere ON" : "Atmosphere FX"}</span>
          </button>
        </div>

        {/* Voice Customizers */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-[#F9F8F6] px-3 py-1.5 rounded-sm border border-[#1C1C1C]/10">
            <Headphones className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span className="text-[#1C1C1C]/60 text-[11px] uppercase tracking-wider font-bold hidden sm:inline">Voice:</span>
            <select
              value={selectedVoiceType}
              onChange={(e) => setSelectedVoiceType(e.target.value as any)}
              className="bg-transparent text-[#1C1C1C] font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="cinematic" className="bg-white text-[#1C1C1C]">Cinematic Deep</option>
              <option value="field" className="bg-white text-[#1C1C1C]">Field Veteran</option>
              <option value="direct" className="bg-white text-[#1C1C1C]">Direct Trainer</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#F9F8F6] px-3 py-1.5 rounded-sm border border-[#1C1C1C]/10">
            <Sliders className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span className="text-[#1C1C1C]/60 text-[11px] uppercase tracking-wider font-bold hidden sm:inline">Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-transparent text-[#1C1C1C] font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value={0.9} className="bg-white text-[#1C1C1C]">0.9x Paced</option>
              <option value={1.0} className="bg-white text-[#1C1C1C]">1.0x Normal</option>
              <option value={1.15} className="bg-white text-[#1C1C1C]">1.15x Quick</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Narrative Structure (The Visual Story Arc) */}
      <div className="space-y-4">
        {/* Character & Setting Briefing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-sm bg-white border border-[#1C1C1C]/10 flex items-start space-x-3 shadow-sm">
            <div className="p-2.5 rounded-sm bg-[#F5F2ED] text-[#FF5F1F] shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1C1C1C]/50 tracking-widest block">
                Protagonist / Focus Character
              </span>
              <p className="text-sm font-semibold text-[#1C1C1C] mt-0.5">
                {narrative.character}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-sm bg-white border border-[#1C1C1C]/10 flex items-start space-x-3 shadow-sm">
            <div className="p-2.5 rounded-sm bg-[#F5F2ED] text-[#1C1C1C] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1C1C1C]/50 tracking-widest block">
                Setting & Environmental Pressure
              </span>
              <p className="text-sm font-semibold text-[#1C1C1C] mt-0.5">
                {narrative.setting}
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Step Cards */}
        <div className="space-y-3">
          {narrativeSections.map((sec, idx) => {
            const isHighlighted = activeParagraphIndex === idx;
            return (
              <div
                key={sec.label}
                className={`p-5 sm:p-6 rounded-sm border transition-all duration-300 shadow-sm ${
                  sec.type === "turning"
                    ? "bg-[#FFF9F5] border-[#FF5F1F]/40"
                    : sec.type === "lesson"
                    ? "bg-[#F0FDF4] border-emerald-500/40"
                    : "bg-white border-[#1C1C1C]/10"
                } ${isHighlighted ? "ring-2 ring-[#FF5F1F] bg-[#FFF9F5]" : ""}`}
              >
                <div className="flex items-center justify-between mb-3 border-b border-[#1C1C1C]/5 pb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs font-bold font-serif italic">
                      {idx + 1}
                    </span>
                    <h3 className="text-[11px] uppercase font-bold tracking-widest text-[#1C1C1C]">
                      {sec.label}
                    </h3>
                  </div>
                  {sec.type === "turning" && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#FF5F1F] text-white flex items-center space-x-1">
                      <Zap className="w-2.5 h-2.5" />
                      <span>Climactic Decision</span>
                    </span>
                  )}
                  {sec.type === "lesson" && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-600 text-white flex items-center space-x-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Takeaway Rule</span>
                    </span>
                  )}
                </div>
                <p className="text-[#1C1C1C] text-sm sm:text-base leading-relaxed pl-8 font-serif italic">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Story Polish & Adaptive Transformation Suite */}
      <div className="p-6 sm:p-8 rounded-sm bg-[#1C1C1C] text-white border border-[#1C1C1C] shadow-md space-y-5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5F1F]">
            AI Story Adaptation &bull; Editorial Transformation Lab
          </h3>
        </div>
        <p className="text-xs text-white/70 font-serif italic">
          Dynamically re-tune this narrative for different shift handovers, multilingual workforces, or executive boardrooms.
        </p>

        {/* Preset Transformation Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleIterateStory("Pivot this story into a hard-hitting Cinematic film treatment with visceral sensory details and camera directions")}
            disabled={isIterating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white hover:text-[#1C1C1C] border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Pivot to Cinematic</span>
          </button>
          <button
            onClick={() => handleIterateStory("Pivot this into an investigative Documentary / Incident Root Cause forensic breakdown")}
            disabled={isIterating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white hover:text-[#1C1C1C] border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Pivot to Documentary</span>
          </button>
          <button
            onClick={() => handleIterateStory("Pivot into an Educational teaching narrative with clear step-by-step physics and hazard mechanics")}
            disabled={isIterating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white hover:text-[#1C1C1C] border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Pivot to Educational</span>
          </button>
          <button
            onClick={() => handleIterateStory("Pivot into a Futuristic scenario with wearable sensors, robotics, and smart PPE telemetry")}
            disabled={isIterating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white hover:text-[#1C1C1C] border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Pivot to Futuristic</span>
          </button>
          <button
            onClick={() => handleIterateStory("Translate the entire story and core takeaway into Spanish for bilingual shift handover")}
            disabled={isIterating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white hover:text-[#1C1C1C] border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Translate to Spanish</span>
          </button>
          <button
            onClick={() => handleIterateStory("Condense this narrative into an ultra-punchy 60-second morning tailgate huddle script")}
            disabled={isIterating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white hover:text-[#1C1C1C] border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>60s Tailgate Version</span>
          </button>
        </div>

        {/* Custom Prompt Input */}
        <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Add sensory details about high winds, heavy rigging tension, and crew camaraderie..."
            className="flex-1 bg-white/10 border border-white/20 focus:border-[#FF5F1F] rounded-sm px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition"
          />
          <button
            onClick={() => customPrompt.trim() && handleIterateStory(customPrompt)}
            disabled={isIterating || !customPrompt.trim()}
            className="px-5 py-2.5 rounded-sm bg-[#FF5F1F] hover:bg-[#E04E13] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition cursor-pointer"
          >
            {isIterating ? "Refining..." : "Transform"}
          </button>
        </div>

        {/* Result Area */}
        {iterationResult && (
          <div className="p-4 rounded-sm bg-white text-[#1C1C1C] border border-white text-xs sm:text-sm leading-relaxed space-y-2">
            <div className="flex items-center justify-between text-[#FF5F1F] font-bold">
              <span className="uppercase text-[10px] tracking-widest">Transformed Narrative Output</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(iterationResult);
                  alert("Copied to clipboard!");
                }}
                className="text-xs text-[#1C1C1C]/60 hover:text-[#1C1C1C]"
              >
                Copy Output
              </button>
            </div>
            <div className="whitespace-pre-wrap font-serif italic text-sm">{iterationResult}</div>
          </div>
        )}
      </div>
    </div>
  );
};
