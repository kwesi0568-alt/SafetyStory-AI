import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  BookOpen,
  Send,
  Wand2,
  HardHat,
  Factory,
  Stethoscope,
  Truck,
  Flame,
  Ship,
  Plane,
  Building2,
  FileText,
  HelpCircle,
  Clock,
  Target,
  Users,
  Compass,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clapperboard,
  Tv,
} from "lucide-react";
import { IndustryType, AudienceType, StoryArchetype, SafetyCampaign, PresetTopic, CreativeConcept } from "../types";
import { PRESET_TOPICS } from "../data/presets";

export interface CampaignCreatorProps {
  onCampaignCreated?: (campaign: SafetyCampaign) => void;
  onGenerate?: (request: any) => Promise<void>;
  isLoading?: boolean;
  isGenerating?: boolean;
  setIsLoading?: (loading: boolean) => void;
  prefilledIdea?: string;
  prefilledIndustry?: string;
}

const INDUSTRIES: { label: IndustryType; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Construction & Rigging", icon: HardHat },
  { label: "Manufacturing & Heavy Plant", icon: Factory },
  { label: "Energy, Oil/Gas & Utilities", icon: Flame },
  { label: "Logistics, Warehousing & Fleet", icon: Truck },
  { label: "Healthcare, Pharma & Labs", icon: Stethoscope },
  { label: "Mining & Maritime", icon: Ship },
  { label: "Aviation & Aerospace", icon: Plane },
  { label: "Corporate, Tech & Facilities", icon: Building2 },
];

const AUDIENCES: { label: AudienceType; desc: string }[] = [
  { label: "Frontline Field Crew & Operators", desc: "Hands-on, direct, gritty, no-nonsense language." },
  { label: "Young Apprentices & New Hires", desc: "Engaging, visual, zero dry jargon, relatable stakes." },
  { label: "Supervisors & Safety Champions", desc: "Empowering leadership, coaching habits, stopping shortcuts." },
  { label: "Corporate Leaders & Execs", desc: "Cultural impact, risk management, human dignity." },
  { label: "Multilingual & Diverse Workforce", desc: "Clear visual metaphors, universally understood analogies." },
  { label: "Contractors & Site Visitors", desc: "Rapid onboarding, immediate orientation, essential boundaries." },
];

const ARCHETYPES: { label: StoryArchetype; emoji: string; category: string; tagline: string }[] = [
  {
    label: "Cinematic",
    emoji: "🎬",
    category: "Official Core",
    tagline: "Dramatic visual storytelling, camera pacing, strong emotional progression and cinematic depth.",
  },
  {
    label: "Documentary",
    emoji: "📽️",
    category: "Official Core",
    tagline: "Realistic narration, factual framing, observational footage and investigative depth.",
  },
  {
    label: "Educational",
    emoji: "📚",
    category: "Official Core",
    tagline: "Prioritizes pedagogical clarity, learning objectives, diagrams, and memorable teaching moments.",
  },
  {
    label: "Dramatic",
    emoji: "⚡",
    category: "Official Core",
    tagline: "High-stakes tension, split-second critical choices, interpersonal conflict and resolution.",
  },
  {
    label: "Futuristic",
    emoji: "🤖",
    category: "Official Core",
    tagline: "Explores automated robotics, smart PPE sensors, AI hazards, and next-gen site tech.",
  },
  {
    label: "Interactive",
    emoji: "🎮",
    category: "Official Core",
    tagline: "Branching decision points ('What would you do?'), immediate consequences and risk scoring.",
  },
  {
    label: "Storytelling",
    emoji: "📖",
    category: "Official Core",
    tagline: "Classic 10-step narrative arc: rich characters, relatable setting, crisis, and enduring lesson.",
  },
  {
    label: "News / Incident Report",
    emoji: "📰",
    category: "Official Core",
    tagline: "Professional reporting structure, urgent investigative debrief without sensationalism.",
  },
  {
    label: "The Modern Fable / Toolbox Parable",
    emoji: "🪵",
    category: "Specialized",
    tagline: "Timeless workplace wisdom passed down through craft mentorship and unforgettable analogy.",
  },
  {
    label: "Everyday Metaphor & Analogy",
    emoji: "💡",
    category: "Specialized",
    tagline: "Translating complex invisible physics or chemical hazards into simple everyday comparisons.",
  },
  {
    label: "Sci-Fi & Graphic Comic Novel",
    emoji: "🦸",
    category: "Specialized",
    tagline: "Heroic vigilance, dynamic panel composition, and bold illustrated graphic energy.",
  },
  {
    label: "Watercooler Satire & Relatable Humor",
    emoji: "☕",
    category: "Specialized",
    tagline: "Warm, witty, anti-boredom workplace honesty that disarms cynicism and sparks conversation.",
  },
];

export const CampaignCreator: React.FC<CampaignCreatorProps> = ({
  onCampaignCreated,
  onGenerate,
  isLoading,
  isGenerating,
  setIsLoading,
  prefilledIdea,
  prefilledIndustry,
}) => {
  const [topic, setTopic] = useState(prefilledIdea || "");
  const [industry, setIndustry] = useState<IndustryType>(
    (prefilledIndustry as IndustryType) || "Construction & Rigging"
  );
  const [audience, setAudience] = useState<AudienceType>("Frontline Field Crew & Operators");
  const [archetype, setArchetype] = useState<StoryArchetype>("Cinematic");
  const [keyRules, setKeyRules] = useState("");
  const [toneModifiers, setToneModifiers] = useState("Emotionally grounded, visceral details, actionable safety takeaway");
  const [loadingStep, setLoadingStep] = useState(0);

  // Ideation Engine state
  const [isIdeating, setIsIdeating] = useState(false);
  const [ideatedConcepts, setIdeatedConcepts] = useState<CreativeConcept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<CreativeConcept | null>(null);

  const isWorking = Boolean(isLoading || isGenerating);

  React.useEffect(() => {
    if (prefilledIdea) {
      setTopic(prefilledIdea);
    }
    if (prefilledIndustry) {
      setIndustry(prefilledIndustry as IndustryType);
    }
  }, [prefilledIdea, prefilledIndustry]);

  const loadingSteps = [
    "SafetyStory AI: Ingesting technical knowledge & hazard mechanics...",
    "Ideating character arcs, setting, and critical decision points...",
    "Directing 5-scene visual storyboard with image & video prompts...",
    "Composing supervisor toolbox talk, pledge, and hands-on checklist...",
    "Developing multi-platform content for LinkedIn, X, TikTok, IG & film script...",
    "Executing safety quality control & factual review check...",
  ];

  const handleApplyPreset = (preset: PresetTopic) => {
    setTopic(preset.title);
    setIndustry(preset.industry);
    setArchetype(preset.suggestedArchetype);
    setKeyRules(preset.coreRule);
    setIdeatedConcepts([]);
    setSelectedConcept(null);
  };

  const handleIdeateConcepts = async () => {
    if (!topic.trim()) return;
    setIsIdeating(true);
    try {
      const res = await fetch("/api/ideate-concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          industry,
          audience,
        }),
      });
      const data = await res.json();
      if (data.concepts && Array.isArray(data.concepts)) {
        setIdeatedConcepts(data.concepts);
      }
    } catch (err) {
      console.error("Failed to ideate concepts:", err);
    } finally {
      setIsIdeating(false);
    }
  };

  const handleSelectConcept = (concept: CreativeConcept) => {
    setSelectedConcept(concept);
    if (concept.recommendedFormat) {
      // Find matching archetype
      const match = ARCHETYPES.find((a) => a.label.toLowerCase() === concept.recommendedFormat.toLowerCase()) ||
                    ARCHETYPES.find((a) => a.label.toLowerCase().includes(concept.recommendedFormat.toLowerCase()));
      if (match) {
        setArchetype(match.label);
      }
    }
    setToneModifiers(`Angle: ${concept.emotionalAngle}. Core Idea: ${concept.coreIdea}`);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (onGenerate) {
      onGenerate({
        topic,
        industry,
        audience,
        archetype,
        keyRules,
        toneModifiers,
        selectedConcept,
      });
      return;
    }

    if (setIsLoading) setIsLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          industry,
          audience,
          archetype,
          keyRules,
          toneModifiers,
          selectedConcept,
        }),
      });

      const data = await res.json();
      if (data.campaign && onCampaignCreated) {
        onCampaignCreated(data.campaign);
      } else {
        throw new Error(data.error || "Failed to generate campaign");
      }
    } catch (err) {
      console.error("Campaign generation error:", err);
    } finally {
      clearInterval(stepInterval);
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Hero Header - Editorial Style */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#FF5F1F] mb-3 block">
          Creative Director Pipeline &bull; Technical Transformation Engine
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-[#1C1C1C] leading-[0.95] tracking-tight mb-4">
          One Safety Idea. <br />
          <span className="not-italic text-[#1C1C1C]">
            An Entire Creative <span className="italic text-[#FF5F1F]">Campaign.</span>
          </span>
        </h1>
        <p className="text-base sm:text-lg text-[#1C1C1C]/70 font-serif italic leading-relaxed max-w-2xl mx-auto">
          Transform technical SOPs, hazard rules, and incident reports into captivating human narratives, production storyboards, and multi-channel communication campaigns.
        </p>
      </div>

      {/* Quick Preset Selector Bar */}
      <div className="mb-8 p-5 rounded-sm bg-white border border-[#1C1C1C]/10 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-[#1C1C1C]/5 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5F1F]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C]">
              Inspiration Launchpad &bull; Industrial Hazard Presets
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#1C1C1C]/40 hidden sm:inline">
            1-Click Auto-Fill
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {PRESET_TOPICS.slice(0, 6).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="group flex items-center space-x-2 px-3 py-1.5 rounded-sm bg-[#F5F2ED] hover:bg-[#1C1C1C] hover:text-white border border-[#1C1C1C]/10 text-xs font-semibold text-[#1C1C1C] transition-all text-left cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] group-hover:bg-white" />
              <span>{preset.title.split(" ")[0]} {preset.title.split(" ")[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Campaign Generation Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-sm border border-[#1C1C1C]/10 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Step 1: Topic & Safety Concept */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C]">
              <FileText className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>1. Technical Topic, Safety SOP, or Hazard Observation</span>
            </label>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF5F1F]">Required</span>
          </div>
          <p className="text-xs text-[#1C1C1C]/60 italic font-serif mb-3">
            Enter a rule, hazard, technical procedure (e.g. &quot;Lockout/Tagout Zero Energy State&quot; or &quot;Working at Heights 100% Tie-Off&quot;), or paste an SOP policy excerpt.
          </p>
          <textarea
            id="safety-topic-input"
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Lockout/Tagout (LOTO) - technicians skipping the zero-energy verification step before clearing mechanical conveyor jams."
            required
            className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/15 focus:border-[#FF5F1F] focus:bg-white focus:ring-1 focus:ring-[#FF5F1F] rounded-sm p-4 text-[#1C1C1C] placeholder-[#1C1C1C]/40 text-sm leading-relaxed transition font-sans"
          />

          {/* Ideation Action Button */}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleIdeateConcepts}
              disabled={!topic.trim() || isIdeating}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                topic.trim() && !isIdeating
                  ? "bg-[#FFF9F5] border-[#FF5F1F]/40 text-[#FF5F1F] hover:bg-[#FF5F1F] hover:text-white shadow-xs"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Lightbulb className={`w-3.5 h-3.5 ${isIdeating ? "animate-spin" : ""}`} />
              <span>{isIdeating ? "Brainstorming 3-5 Creative Pitches..." : "✨ Ideate 3-5 Creative Concepts"}</span>
            </button>
            <span className="text-[10px] text-[#1C1C1C]/50 font-serif italic">
              Explores diverse angles: Cinematic, Documentary, Interactive, & Parables
            </span>
          </div>

          {/* Ideated Concepts Display */}
          {ideatedConcepts.length > 0 && (
            <div className="mt-4 p-4 rounded-sm bg-[#FFFDF9] border border-[#FF5F1F]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#FF5F1F]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Creative Ideation Pitches (Select one to guide the campaign)</span>
                </div>
                <span className="text-[10px] text-[#1C1C1C]/50 font-bold uppercase">
                  {ideatedConcepts.length} Pitches Generated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ideatedConcepts.map((concept) => {
                  const isSelected = selectedConcept?.id === concept.id || selectedConcept?.title === concept.title;
                  return (
                    <div
                      key={concept.id || concept.title}
                      onClick={() => handleSelectConcept(concept)}
                      className={`p-3.5 rounded-sm border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md"
                          : "bg-white border-[#1C1C1C]/10 hover:border-[#FF5F1F]/50 text-[#1C1C1C]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                            isSelected ? "bg-[#FF5F1F] text-white" : "bg-[#F9F8F6] text-[#FF5F1F] border border-[#FF5F1F]/20"
                          }`}>
                            {concept.recommendedFormat || "Creative Concept"}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5F1F]" />}
                        </div>
                        <h5 className="font-serif italic font-bold text-sm leading-snug">
                          {concept.title}
                        </h5>
                        <p className={`text-xs mt-1 leading-relaxed ${isSelected ? "text-slate-200" : "text-[#1C1C1C]/80"}`}>
                          &ldquo;{concept.hook}&rdquo;
                        </p>
                      </div>

                      <div className={`pt-2 border-t text-[11px] space-y-1 ${isSelected ? "border-white/10 text-slate-300" : "border-[#1C1C1C]/5 text-[#1C1C1C]/60"}`}>
                        <div><strong>Angle:</strong> {concept.emotionalAngle}</div>
                        <div><strong>Why it works:</strong> {concept.whyEngaging}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Industry & Workplace Domain */}
        <div>
          <label className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>2. Industry Domain</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INDUSTRIES.map((ind) => {
              const Icon = ind.icon;
              const isSelected = industry === ind.label;
              return (
                <button
                  key={ind.label}
                  type="button"
                  onClick={() => setIndustry(ind.label)}
                  className={`flex flex-col items-start p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm"
                      : "bg-[#F9F8F6] border-[#1C1C1C]/10 text-[#1C1C1C]/80 hover:bg-[#F0EFEC]"
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-2 ${isSelected ? "text-[#FF5F1F]" : "text-[#1C1C1C]/60"}`} />
                  <span className="text-xs font-bold leading-tight">{ind.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Creative Storytelling Archetype (9 Official Modes) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C]">
              <Wand2 className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>3. Creative Mode & Archetype</span>
            </label>
            <span className="text-[10px] text-[#FF5F1F] font-bold uppercase tracking-wider">
              9 Official Creative Modes
            </span>
          </div>
          <p className="text-xs text-[#1C1C1C]/60 italic font-serif mb-3">
            Select the dramatic medium engineered to anchor the safety protocol permanently in human memory.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {ARCHETYPES.map((arch) => {
              const isSelected = archetype === arch.label;
              return (
                <div
                  key={arch.label}
                  onClick={() => setArchetype(arch.label)}
                  className={`cursor-pointer p-3.5 rounded-sm border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm ring-1 ring-[#FF5F1F]"
                      : "bg-[#F9F8F6] border-[#1C1C1C]/10 text-[#1C1C1C] hover:bg-[#F0EFEC]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm">{arch.emoji}</span>
                        <span className="text-xs font-bold">{arch.label}</span>
                      </div>
                    </div>
                    <p className={`text-[10px] leading-relaxed ${isSelected ? "text-slate-300" : "text-[#1C1C1C]/60 font-serif italic"}`}>
                      {arch.tagline}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-[9px] uppercase tracking-widest text-[#FF5F1F] font-bold">
                      &bull; Selected Mode
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Target Audience & Key Rules Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-[#1C1C1C]/10">
          {/* Target Audience */}
          <div>
            <label className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C] mb-2">
              <Users className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>4. Target Audience Calibration</span>
            </label>
            <div className="space-y-2">
              {AUDIENCES.map((aud) => {
                const isSelected = audience === aud.label;
                return (
                  <button
                    key={aud.label}
                    type="button"
                    onClick={() => setAudience(aud.label)}
                    className={`w-full flex items-center justify-between p-3 rounded-sm border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                        : "bg-[#F9F8F6] border-[#1C1C1C]/10 text-[#1C1C1C] hover:bg-[#F0EFEC]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{aud.label}</div>
                      <div className={`text-[11px] ${isSelected ? "text-slate-300" : "text-[#1C1C1C]/60 italic font-serif"}`}>
                        {aud.desc}
                      </div>
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF5F1F]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Specifics to Emphasize */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C] mb-2">
                <Target className="w-3.5 h-3.5 text-[#FF5F1F]" />
                <span>5. Key Life-Saving Protocol (Optional Focus)</span>
              </label>
              <textarea
                rows={2}
                value={keyRules}
                onChange={(e) => setKeyRules(e.target.value)}
                placeholder="e.g. Always test the start button to prove zero voltage after applying personal padlock."
                className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/15 focus:border-[#FF5F1F] focus:bg-white focus:ring-1 focus:ring-[#FF5F1F] rounded-sm p-3 text-[#1C1C1C] placeholder-[#1C1C1C]/40 text-xs sm:text-sm leading-relaxed transition font-sans"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5F1F]" />
                <span>Creative Tone Modifiers</span>
              </label>
              <input
                type="text"
                value={toneModifiers}
                onChange={(e) => setToneModifiers(e.target.value)}
                placeholder="e.g. Gritty realism, heartfelt family motive, fast adrenaline"
                className="w-full bg-[#F9F8F6] border border-[#1C1C1C]/15 focus:border-[#FF5F1F] focus:bg-white focus:ring-1 focus:ring-[#FF5F1F] rounded-sm p-3 text-[#1C1C1C] placeholder-[#1C1C1C]/40 text-xs transition font-sans"
              />
            </div>

            {/* Factual Integrity & Review Reminder */}
            <div className="p-3.5 rounded-sm bg-[#F9F8F6] border border-[#1C1C1C]/10 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FF5F1F] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#1C1C1C]/70 leading-relaxed font-serif italic">
                <strong>Safety Governance:</strong> Stories promote hazard awareness without fabricating technical standards. Always review outputs against site-specific procedures before deployment.
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button / Loading Status */}
        <div className="pt-6 border-t border-[#1C1C1C]/10 flex flex-col items-center">
          {isWorking ? (
            <div className="w-full max-w-lg p-8 rounded-sm bg-[#1C1C1C] text-white border border-[#1C1C1C] text-center space-y-5 shadow-xl">
              <div className="inline-flex p-3 rounded-full bg-[#FF5F1F]/20 text-[#FF5F1F] animate-spin">
                <Wand2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5F1F]">
                  SafetyStory AI Creative Engine
                </h4>
                <p className="text-lg font-serif italic text-white">
                  Transforming Safety Knowledge Into Campaign
                </p>
                <p className="text-xs text-slate-300 font-mono pt-1">
                  {loadingSteps[loadingStep]}
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-[#FF5F1F] h-1 transition-all duration-700"
                  style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              id="generate-campaign-submit-btn"
              type="submit"
              disabled={!topic.trim()}
              className={`w-full max-w-md flex items-center justify-center space-x-3 py-4 px-8 rounded-sm text-xs font-bold uppercase tracking-widest shadow-md transition-all ${
                topic.trim()
                  ? "bg-[#1C1C1C] hover:bg-[#FF5F1F] text-white hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  : "bg-[#1C1C1C]/20 text-[#1C1C1C]/40 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
              <span>Transform Idea Into Entire Campaign</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#1C1C1C]/40 mt-3 text-center">
            Pipeline: 10-Step Narrative &bull; Storyboard &bull; 4-Min Toolbox Talk &bull; Interactive Simulator &bull; 60s Script &bull; Multi-Platform Social
          </p>
        </div>
      </form>
    </div>
  );
};

