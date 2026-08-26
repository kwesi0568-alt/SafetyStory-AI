export type IndustryType =
  | "Construction & Rigging"
  | "Manufacturing & Heavy Plant"
  | "Healthcare, Pharma & Labs"
  | "Logistics, Warehousing & Fleet"
  | "Energy, Oil/Gas & Utilities"
  | "Mining & Maritime"
  | "Aviation & Aerospace"
  | "Corporate, Tech & Facilities";

export type AudienceType =
  | "Frontline Field Crew & Operators"
  | "Young Apprentices & New Hires"
  | "Supervisors & Safety Champions"
  | "Corporate Leaders & Execs"
  | "Multilingual & Diverse Workforce"
  | "Contractors & Site Visitors";

export type StoryArchetype =
  | "Cinematic"
  | "Cinematic Movie Trailer"
  | "Documentary"
  | "Educational"
  | "Dramatic"
  | "Futuristic"
  | "Interactive"
  | "Storytelling"
  | "News / Incident Report"
  | "Dramatic Micro-Drama"
  | "The Modern Fable / Toolbox Parable"
  | "Sci-Fi & Graphic Comic Novel"
  | "Investigative Case File / True Crime"
  | "Everyday Metaphor & Analogy"
  | "Watercooler Satire & Relatable Humor";

export interface CreativeConcept {
  id: string;
  title: string;
  hook: string;
  coreIdea: string;
  emotionalAngle: string;
  recommendedFormat: StoryArchetype;
  whyEngaging: string;
}

export interface CreateCampaignRequest {
  topic: string;
  industry: string;
  audience: string;
  archetype: string;
  keyRules?: string;
  toneModifiers?: string;
  selectedConcept?: CreativeConcept;
}

export interface StoryboardScene {
  sceneNumber: number;
  duration?: string;
  location?: string;
  characters?: string;
  caption: string;
  visualDescription: string;
  action?: string;
  dialogue: string;
  voiceover?: string;
  cameraAngle: string;
  onScreenText?: string;
  soundMusicDirection?: string;
  safetyMessage?: string;
  prompt: string;
  videoPrompt?: string;
  imageUrl?: string;
}

export interface InteractiveChoice {
  text: string;
  consequence: string;
  riskDelta: number;
  correct: boolean;
  explanation: string;
}

export interface InteractiveStep {
  stepId: number;
  situation: string;
  question: string;
  choices: InteractiveChoice[];
}

export interface VideoScriptScene {
  time: string;
  visual: string;
  audio: string;
}

export interface VideoScript {
  title: string;
  directorNotes: string;
  scenes: VideoScriptScene[];
}

export interface AudioDrama {
  title: string;
  format: string;
  characters: string[];
  dialogueSnippet: string;
}

export interface PosterConcept {
  headline: string;
  subheadline: string;
  callToAction: string;
  designStyle: string;
}

export interface SocialPlatformContent {
  linkedin: {
    hook: string;
    body: string;
    takeaway: string;
    hashtags: string[];
  };
  facebook: {
    post: string;
    callToAction: string;
  };
  xTwitter: {
    thread: string[];
  };
  instagram: {
    caption: string;
    carouselSlides: string[];
    reelConcept: string;
  };
  tiktok: {
    hook: string;
    script: string;
    onScreenCues: string;
  };
  youtubeShorts: {
    title: string;
    pacingNotes: string;
    script: string;
  };
}

export interface SocialMicroContent {
  slackTeamsTip: string;
  instagramCarousel: string[];
  digitalSignageLoop: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NarrativeStructure {
  title: string;
  character: string;
  setting: string;
  // 10-Step Story Structure
  hook?: string;
  initialSituation?: string;
  conflictOrRisk?: string;
  criticalDecision?: string;
  consequence?: string;
  interventionOrResolution?: string;
  keyLesson?: string;
  callToAction?: string;
  // Backwards compatibility keys
  incitingIncident?: string;
  conflict?: string;
  turningPoint?: string;
  resolution?: string;
  lessonTakeaway?: string;
}

export interface SafetyCampaign {
  id: string;
  createdAt: string;
  topic: string;
  industry: string;
  audience: string;
  archetype: string;
  campaignTitle: string;
  slogan: string;
  emotionalHook: string;
  coreRuleSummary: string;
  reviewNote?: string;
  impactMetrics: {
    memorabilityScore: number;
    emotionalResonance: number;
    clarityScore: number;
    actionableImpact: number;
  };
  narrative: NarrativeStructure;
  storyboard: StoryboardScene[];
  toolboxTalk: {
    durationMinutes: number;
    openingHook: string;
    discussionPoints: string[];
    handsOnChecklist: string[];
    crewPledge: string;
  };
  interactiveScenario: {
    title: string;
    briefing: string;
    steps: InteractiveStep[];
  };
  multimediaConcepts: {
    videoScript: VideoScript;
    audioDrama: AudioDrama;
    posterConcept: PosterConcept;
    socialMicroContent: SocialMicroContent;
    socialPlatforms?: SocialPlatformContent;
  };
  knowledgeQuiz: QuizQuestion[];
}

export interface PresetTopic {
  id: string;
  title: string;
  industry: IndustryType;
  category: string;
  hazard: string;
  coreRule: string;
  suggestedArchetype: StoryArchetype;
  shortDesc: string;
}

