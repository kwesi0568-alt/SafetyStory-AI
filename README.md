# SafetyStory AI 🦺

> **One Safety Idea. An Entire Creative Campaign.**

AI-powered workplace safety storytelling and 360-degree HSE creative campaign platform designed for Health, Safety & Environment leaders, safety managers, frontline supervisors, and workforce educators.

![SafetyStory AI Preview](/src/assets/images/safetystory_hero_preview_1787942377780.jpg)

---

## 1. 📌 Problem Statement

Every year, millions of preventable industrial workplace incidents and near-misses occur across construction, manufacturing, energy, logistics, and healthcare. Despite strict compliance frameworks (such as OSHA, ISO 45001, and ANSI standards), traditional safety communication suffers from severe structural challenges:

1. **Compliance Fatigue & Dry Jargon**: Regulatory manuals, mandatory slide decks, and repetitive warnings fail to engage frontline teams, apprentices, or contractors.
2. **Cognitive & Emotional Disconnect**: Standard SOPs explain *what* rule to follow, but fail to convey the emotional, human, and family stakes of a single split-second shortcut.
3. **High Creative Campaign Production Overhead**: Producing engaging multi-channel safety materials (narratives, storyboards, supervisor huddle briefings, posters, audio clips, interactive scenarios) typically requires an entire creative agency team and weeks of turnaround per hazard.
4. **Passive Learning vs. Decision Practice**: Workers are talked *at* rather than challenged to test their situational hazard awareness under realistic shift pressure.

---

## 2. 💡 Solution Description

**SafetyStory AI** acts as an on-demand AI creative agency and instructional designer for workplace health and safety. Starting from a single hazard scenario, regulatory rule, or near-miss observation, the system synthesizes a complete, multi-asset safety campaign:

- **10-Step Narrative Drama Arc**: Authentic frontline characters navigating realistic dilemmas, rising risks, critical decision points, near-miss outcomes, and life-saving lessons. Includes browser-based Text-to-Speech (TTS) narration and live AI story iteration.
- **5-Scene Production Storyboard**: Visual keyframe breakdowns with camera angles, lighting cues, dialogue, and AI image generation prompts across multiple art styles.
- **4-Minute Supervisor Toolbox Talk & Crew Pledge**: Pre-shift huddle script with an opening hook, 3 discussion prompts, a 4-point pre-task checklist, and formal crew commitment sign-off.
- **Interactive Branching Decision Simulator**: Scenario-based "Choose Your Path" simulator calculating risk delta scores and consequences in real time.
- **Multi-Platform Media Suite**: 60-second video scripts with timed cues, 3D spatial audio drama direction, and pre-formatted copy for SMS/WhatsApp alerts, digital signage, LinkedIn thought leadership, and email digests.
- **Safety Poster Studio**: Print and digital poster layouts with bold headlines, focal visual concepts, and high-impact call-to-action footers.
- **Knowledge & Mastery Quiz**: Interactive scenario questions with immediate feedback and safety rationales.
- **Executive Dossier & Exporter**: 1-click generation of print-ready HTML/PDF campaign briefs and JSON exports.

---

## 3. 🧠 AI Approach & Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser / SPA)                   │
│  - React 19 + TypeScript + Vite + Tailwind CSS v4          │
│  - Interactive Simulator State & Local Storage Vault        │
│  - Web Speech API (Live Audio Narration)                    │
│  - Canvas Confetti & Dynamic Media Customizers              │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API (/api/*)
┌──────────────────────────────▼──────────────────────────────┐
│                  Server-Side Express Backend                │
│  - Node.js runtime bundled with esbuild (`dist/server.cjs`) │
│  - Secure API Key Protection (Gemini key never in browser)  │
│  - Multi-tier Fallback & Resilient Generation Engine        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Google Gen AI SDK (@google/genai)
┌──────────────────────────────▼──────────────────────────────┐
│                     Google Gemini Models                    │
│  - Gemini 2.5 Flash / Gemini 2.0 Flash (Campaign Synthesis) │
│  - Imagen 3 (Visual Storyboards & Poster Generation)        │
└─────────────────────────────────────────────────────────────┘
```

### AI Pipeline & Prompt Engineering Strategy
1. **Creative Ideation Stage (`/api/ideate-concepts`)**: Analyzes the raw hazard input and pitches 3–5 distinct creative angles (Cinematic, Documentary, Interactive, Dramatic, Modern Fable) before full campaign generation.
2. **Structured Multi-Asset Synthesis (`/api/generate-campaign`)**: Uses Gemini's JSON Schema enforcement (`responseMimeType: "application/json"`) to generate the entire multi-asset campaign suite in a single structured response.
3. **Model Cascading & Fallback Resilience**: Automated graceful fallback across Gemini model aliases (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash`) with offline heuristic backup.
4. **Visual Synthesis (`/api/generate-image`)**: Leverages Imagen 3 with tailored prompts and selectable artistic presets (Photorealistic, Graphic Novel, Watercolor, Blueprint, Cinematic Film Still).
5. **In-line AI Story Iteration (`/api/iterate-story`)**: Targeted story rewrites to heighten emotional stakes, translate into frontline vernacular, or simplify for new apprentices.

---

## 4. 🎨 Selected Theme & Design System

SafetyStory AI utilizes an **Editorial Industrial Luxury / High-Visibility Safety** aesthetic:

- **Typography**:
  - **Headings & Narrative Display**: Classical high-contrast Serif (*Playfair Display / Editorial Serif*) for narrative gravity and emotional resonance.
  - **Interface & Operational Data**: Clean, functional Sans-Serif (*Plus Jakarta Sans / Inter*) for high legibility on checklists, metrics, and risk deltas.
  - **Prompts & Directives**: Precision Monospace (*JetBrains Mono*) for image generation prompts and camera directions.
- **Color System**:
  - **Safety Blaze Accent (`#FF5F1F` / Vivid Safety Orange)**: Evoking high-visibility PPE, traffic safety cones, and urgent focus without visual noise.
  - **Industrial Charcoal (`#1C1C1C` / `#121212`)**: High-contrast, grounded editorial framing.
  - **Warm Chalk Background (`#FBF9F5` / `#F5F2ED`)**: High-readability warm neutral surface that eliminates eye strain during shift planning.
- **Layout Craft**:
  - Zero arbitrary gradients or decorative clutter.
  - Generous negative space, clear visual hierarchy, and mathematically proportional spacing.

---

## 5. ⚡ How Google AI Studio & Gemini Were Used

Google AI Studio and the **`@google/genai` TypeScript SDK** power the application's intelligence layer:

1. **Gemini 2.5 Flash for Multimodal Creative Direction**:
   - Acts as the campaign director, structuring complex technical rules into 10-step human stories, supervisor briefing scripts, and media cue sheets.
   - Leverages strict JSON Schema enforcement (`responseSchema`) ensuring 100% type compatibility with frontend TypeScript interfaces.
2. **Imagen 3 for Visual Storyboards & Posters**:
   - Synthesizes keyframe artwork, poster illustrations, and visual prompts aligned with camera angles, lighting conditions, and PPE standards.
3. **Domain-Tuned System Prompts**:
   - Embedded HSE system prompts prioritize psychological safety, behavioral nudges, and realistic hazard mechanics over generic tropes.
4. **Server-Side API Security**:
   - All Gemini SDK operations are encapsulated inside secure Node.js backend routes (`/api/*`), ensuring API keys remain strictly server-side.

---

## 🏗️ Supported Archetypes & Industries

### Creative Archetypes
- 🎬 **Cinematic**: Dramatic visual pacing and emotional progression.
- 🎥 **Documentary**: Factual narration, investigative framing, and root-cause focus.
- 🎭 **Dramatic**: High-stakes interpersonal tension and split-second critical choices.
- 🎮 **Interactive**: Branching decision points with risk scoring.
- 📖 **Storytelling**: Classic 10-step narrative arc with relatable craft characters.
- 🚀 **Futuristic**: Automated robotics, smart PPE sensors, and next-gen site tech.
- 📰 **News / Incident Report**: Professional reporting structure and investigative debrief.
- 🦅 **The Modern Fable / Toolbox Parable**: Timeless workplace analogies and memorable wisdom.
- 🎨 **Sci-Fi & Graphic Novel**: Dynamic comic panels and bold visual energy.
- ☕ **Watercooler Satire & Relatable Humor**: Witty, honest dialogue that disarms worker cynicism.

### Industry Verticals
- 🏗️ Construction & Rigging
- 🏭 Manufacturing & Heavy Plant
- 🔥 Energy, Oil/Gas & Utilities
- 🚛 Logistics, Warehousing & Fleet
- 🩺 Healthcare, Pharma & Labs
- 🚢 Mining & Maritime
- ✈️ Aviation & Aerospace
- 🏢 Corporate, Tech & Facilities

---

## 💻 Tech Stack Summary

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **Animation & UI**: Motion (`motion/react`), Lucide React icons, Canvas Confetti
- **Backend**: Express.js (Node.js runtime bundled with `esbuild` / executed with `tsx`)
- **AI Models**: Google Gemini API via `@google/genai` (Gemini 2.5 Flash, Gemini 2.0 Flash, Imagen 3)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([Get one via Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd safety-story-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

- `npm run dev`: Starts the Express server with Vite middleware on port 3000.
- `npm run build`: Compiles the React client with Vite and bundles the Express backend with esbuild into `dist/`.
- `npm start`: Runs the production CommonJS server from `dist/server.cjs`.
- `npm run lint`: Validates TypeScript types across the project (`tsc --noEmit`).

---

## 🔒 Security & Privacy

- All Gemini API interactions and credentials reside strictly server-side (`server.ts`) and are never exposed to the client-side bundle.
- User-generated campaigns are stored safely in local browser storage (`localStorage`) for instant access without external tracking.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
