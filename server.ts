import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy Google Gen AI client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Multi-model resilience helper: handles 503s (high demand) and 429s by cascading models
async function generateWithModelCascade(ai: GoogleGenAI, requestConfig: any) {
  const candidateModels = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-2.0-flash"];
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        ...requestConfig,
        model: modelName,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[Gemini Cascade] Model ${modelName} encountered: ${err.message || err}. Trying next model...`);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("All Gemini models unavailable in cascade");
}

// Dynamic fallback concepts generator
function generateFallbackConcepts(topic: string, industry: string, audience: string) {
  const cleanTopic = topic.trim() || "Hazard Prevention & Safety Protocols";
  return [
    {
      id: "concept_1",
      title: `The Echo of a Split Second`,
      hook: `One critical choice changes an entire lifetime on the shift.`,
      coreIdea: `A high-impact human story examining the silent pressures of cutting corners versus the life-saving relief of following protocol for ${cleanTopic}.`,
      emotionalAngle: `High personal stakes, family responsibility, and craft integrity.`,
      recommendedFormat: "Cinematic",
      whyEngaging: `Visceral sensory tension and relatable character motivations create deep emotional retention.`,
    },
    {
      id: "concept_2",
      title: `Forensic Breakdown: The Anatomy of a Near Miss`,
      hook: `Disasters don't start with a bang; they start with an overlooked check.`,
      coreIdea: `An investigative documentary deconstructing the invisible sequence of mechanical and human factors in ${cleanTopic}.`,
      emotionalAngle: `Analytical curiosity and objective professional pride.`,
      recommendedFormat: "Documentary",
      whyEngaging: `Step-by-step forensic clarity makes complex SOPs intuitive and memorable.`,
    },
    {
      id: "concept_3",
      title: `Interactive Shift: The Crossroad Choice`,
      hook: `You have 30 seconds before release. What is your call?`,
      coreIdea: `A branching scenario simulator testing hazard assessment under realistic deadline pressure for ${cleanTopic}.`,
      emotionalAngle: `Agency, empowerment, and direct accountability.`,
      recommendedFormat: "Interactive",
      whyEngaging: `Active decision-making triggers cognitive agency and lasting behavioral compliance.`,
    },
    {
      id: "concept_4",
      title: `The Veteran's Toolbox Parable`,
      hook: `The gear doesn't just protect you—it protects who is waiting at home.`,
      coreIdea: `A modern workplace fable passed down through craft mentorship and unforgettable analogy regarding ${cleanTopic}.`,
      emotionalAngle: `Camaraderie, peer mentorship, and craft pride.`,
      recommendedFormat: "Storytelling",
      whyEngaging: `Warm, respectful storytelling honors frontline craft wisdom and builds safety culture.`,
    },
  ];
}

// Dynamic fallback campaign generation when API is offline or during demand spikes
function generateFallbackCampaign(topic: string, industry: string, audience: string, archetype: string, concept?: any) {
  const cleanTopic = topic.trim() || "Critical Hazard Identification & Zero Compromise";
  const ind = industry || "Industrial Operations";
  const aud = audience || "Frontline Field Crew & Operators";
  const arch = archetype || "Cinematic";

  const titlePrefix = concept?.title || `Operation Vigilance: ${cleanTopic.split(" ").slice(0, 4).join(" ")}`;

  return {
    id: "camp_" + Date.now(),
    createdAt: new Date().toISOString(),
    topic: cleanTopic,
    industry: ind,
    audience: aud,
    archetype: arch,
    campaignTitle: titlePrefix,
    slogan: `Precision in Every Step. Home Safe Every Shift.`,
    emotionalHook: `A single shortcut takes seconds; living with the consequence lasts a lifetime. Safety is our non-negotiable standard for ${cleanTopic}.`,
    coreRuleSummary: `Always conduct pre-task hazard assessments, verify mechanical interlocks, maintain 100% adherence to standard operating procedures, and execute stop-work authority whenever risk arises.`,
    impactMetrics: {
      memorabilityScore: 96,
      emotionalResonance: 94,
      clarityScore: 98,
      actionableImpact: 97,
    },
    narrative: {
      title: `The Unseen Barrier`,
      character: `Alex Rivera, Lead Technician with 9 years of site experience`,
      setting: `Primary operational facility floor during high-output shift change`,
      hook: `When speed competes with safety, physics always takes the final vote.`,
      initialSituation: `Operations are running at peak capacity with an urgent delivery timeline approaching. Alex is overseeing the execution of ${cleanTopic}.`,
      conflictOrRisk: `A minor bottleneck occurs. Bypassing a verification protocol or rushing the check would save 15 minutes, but elevates mechanical risk exponentially.`,
      criticalDecision: `Despite production pressure and radio calls, Alex pauses, recalls the site's zero-harm pledge, and halts the line to perform the full inspection protocol.`,
      consequence: `During the dedicated inspection, Alex discovers an unseen mechanical flaw that would have catastrophically failed under operational load.`,
      interventionOrResolution: `The hazard is neutralized safely. Operations resume with full verified integrity, protecting the entire shift team.`,
      keyLesson: `Never trade an irreversible consequence for a temporary convenience. Standard operating procedures exist because someone's life once depended on them.`,
      callToAction: `Before you initiate work today: Stop. Inspect. Verify. If anything feels unsafe, exercise your Stop-Work Authority immediately.`,
      incitingIncident: `A warning indicator blinks on the control panel just as the supervisor calls for expedited turnaround.`,
      conflict: `The clock is ticking against deadline milestones, tempting the crew to skip secondary isolation.`,
      turningPoint: `Alex steps in front of the console, signals team timeout, and executes the formal safety checklist step by step.`,
      resolution: `The system is safely verified and calibrated. The crew finishes the shift intact, demonstrating that true productivity is safe productivity.`,
      lessonTakeaway: `Speed without safety is just a countdown to an incident. Quality craft begins and ends with verified controls.`,
    },
    storyboard: [
      {
        sceneNumber: 1,
        duration: "10s",
        location: `${ind} facility floor at shift start`,
        characters: "Alex (lead technician in high-vis PPE and safety glasses)",
        caption: `Dawn on the Production Line`,
        visualDescription: `Cinematic wide shot: Industrial machinery humming in the background as morning light streams through facility windows. Alex prepares gear and inspects SOP tablets.`,
        action: `Alex reviews the shift safety briefing on the digital console`,
        dialogue: `Alex (VO): 'Every shift has thousands of moving parts. But only one metric truly matters: everyone going home whole.'`,
        cameraAngle: `Low-angle tracking shot with cinematic depth of field`,
        onScreenText: `Rule #1: Pre-Task Inspection is Mandatory`,
        soundMusicDirection: `Atmospheric industrial ambient hum with subtle rhythmic bass pulse`,
        safetyMessage: `Always verify baseline conditions and equipment calibration before initiating shift tasks`,
        prompt: `Cinematic movie still of an industrial technician in high-vis gear inspecting equipment in a modern clean manufacturing facility, morning sunlight, photorealistic 8k editorial`,
        videoPrompt: `Cinematic tracking shot through modern industrial plant. Technician in safety glasses and protective vest examines machinery control interface, crisp 24fps film realism.`,
      },
      {
        sceneNumber: 2,
        duration: "12s",
        location: "Main control station and access junction",
        characters: "Alex and Shift Team Lead",
        caption: `The Pressure Point`,
        visualDescription: `Medium close-up: A red warning beacon flashes faintly on an isolation valve. The radio squawks with urgent requests to speed up output.`,
        action: `Alex notices the anomalous reading and reaches for the safety lockout protocol`,
        dialogue: `Radio: 'Team, we need this unit live in 5 minutes!' Alex: 'Hold status. We don't bypass verification.'`,
        cameraAngle: `Over-the-shoulder tension shot focusing on the critical gauge reading`,
        onScreenText: `Deadlines Pass. Safety is Permanent.`,
        soundMusicDirection: `Rising harmonic tension and subtle mechanical clock ticking`,
        safetyMessage: `Never compromise life-critical checklists to meet schedule constraints`,
        prompt: `Close-up of a technician's gloved hand turning a heavy industrial lockout tagout device on a high-pressure panel, high contrast cinematic lighting 8k`,
        videoPrompt: `Dolly push-in on industrial control console with warning gauge. Worker pauses hand, reaches for yellow lockout padlock, decisive professional execution.`,
      },
      {
        sceneNumber: 3,
        duration: "8s",
        location: "Equipment isolation bay",
        characters: "Alex",
        caption: `The Decisive Intervention`,
        visualDescription: `Tight macro shot: Alex places the safety lock on the master power breaker with a resounding mechanical click.`,
        action: `Alex tests for zero energy state and tags the line with crew credentials`,
        dialogue: `Alex: 'Zero energy verified. Nobody touches this until it is 100% safe.' *CLICK*`,
        cameraAngle: `Extreme close-up on padlock snapping shut over hasp`,
        onScreenText: `Verify Zero Energy State`,
        soundMusicDirection: `Sudden pause in music followed by solid tactile latch click echoing clearly`,
        safetyMessage: `Always test before you touch and confirm isolation at the point of work`,
        prompt: `Macro shot of heavy steel safety padlock snapping into a red lockout hasp on an electrical breaker panel, industrial realism, sharp focus`,
        videoPrompt: `Macro 60fps slow-motion capture of steel padlock clicking shut on industrial isolation switch, crisp mechanical focus.`,
      },
      {
        sceneNumber: 4,
        duration: "14s",
        location: "Internal inspection port",
        characters: "Alex and Senior Inspector",
        caption: `The Hidden Hazard Uncovered`,
        visualDescription: `Action shot: Removing the service panel reveals a hairline fracture and loose coupling that would have ruptured under standard operating pressure.`,
        action: `Alex shines an inspection light directly onto the compromised fitting`,
        dialogue: `Inspector: 'That would have failed within 20 minutes under full load. Good catch, Alex.'`,
        cameraAngle: `Dynamic side angle with high-intensity inspection beam`,
        onScreenText: `Stop-Work Authority Saves Lives`,
        soundMusicDirection: `Tense brass chord releasing into steady reassuring musical score`,
        safetyMessage: `Empowered workers stopping unsafe work prevent catastrophic failures`,
        prompt: `Industrial worker shining a bright LED inspection torch into complex mechanical conduit showing precision diagnostics, hyper-realistic 8k`,
        videoPrompt: `Camera pans from bright flashlight beam illuminating machinery component to technician's focused expression, relief and professionalism.`,
      },
      {
        sceneNumber: 5,
        duration: "16s",
        location: "Facility exit gates and departure parking area at dusk",
        characters: "Alex and Crew Colleagues",
        caption: `The Ultimate Outcome`,
        visualDescription: `Warm twilight shot: Alex and crew members high-five and walk out through the facility gates, smiling and heading home safely to their families.`,
        action: `Alex checks off the shift logbook and steps into the evening light`,
        dialogue: `Alex: 'Zero incidents, 100% integrity. See you all tomorrow morning.'`,
        cameraAngle: `Warm wide tracking shot against golden evening skyline`,
        onScreenText: `Safety is our Daily Promise`,
        soundMusicDirection: `Uplifting acoustic and strings melody fading gently into silence`,
        safetyMessage: `Every safety protocol is engineered to ensure every worker returns home safely every single day`,
        prompt: `Heartwarming scene of industrial coworkers in work boots and casual clothes walking out of facility into sunset, smiling, cinematic lighting 8k`,
        videoPrompt: `Wide cinematic shot of industrial workers leaving plant at sunset, chatting and laughing, golden hour glow, slow-motion warmth.`,
      },
    ],
    toolboxTalk: {
      durationMinutes: 4,
      openingHook: `If taking a 60-second shortcut carried a 100% guarantee of stopping you from seeing your family tonight, would you ever take it?`,
      discussionPoints: [
        `What are the most common subtle time pressures on our shift that tempt us to skip verification steps for ${cleanTopic}?`,
        `How can we support each other as peers when someone calls a Stop-Work pause on an active line?`,
        `What is one specific mechanical or environmental condition we must double-check before starting work today?`,
      ],
      handsOnChecklist: [
        `Inspect personal protective equipment (PPE) and condition ratings before donning.`,
        `Verify mechanical and electrical energy isolations at the source point.`,
        `Check that emergency stop controls and communication channels are clear and operational.`,
        `Conduct a 360-degree walkaround of the active work zone for slip, trip, and line-of-fire hazards.`,
      ],
      crewPledge: `We promise to never choose speed over safety, to watch our teammates' backs without hesitation, and to return home safe and sound after every single shift.`,
    },
    interactiveScenario: {
      title: `Shift Decision: The Protocol Crossroad`,
      briefing: `You are leading the scheduled execution of ${cleanTopic}. Production dispatch is reporting a 20-minute backlog, while your pre-start check identifies an ambiguous sensor variance.`,
      steps: [
        {
          stepId: 1,
          situation: `Dispatch messages that the transport truck is idling. Your partner suggests starting the run while they perform the secondary check on the fly.`,
          question: `What is your immediate course of action?`,
          choices: [
            {
              text: `Start the operation now to stay on schedule while monitoring the sensor remotely.`,
              consequence: `The sensor variance escalates into an uncontrolled pressure surge, triggering an emergency shutdown and near-miss.`,
              riskDelta: 50,
              correct: false,
              explanation: `Never initiate work with unverified safety barriers. Remote monitoring does not substitute for physical confirmation.`,
            },
            {
              text: `Enact Stop-Work Authority: hold line start until physical zero-verification is completed.`,
              consequence: `The physical check identifies a loose hydraulic seal. It is repaired in 3 minutes, preventing a major equipment blowout.`,
              riskDelta: -15,
              correct: true,
              explanation: `Stopping work to verify unknown risks protects workers and prevents catastrophic equipment loss.`,
            },
          ],
        },
        {
          stepId: 2,
          situation: `A contractor team arrives to assist without the required site-specific PPE orientation for ${cleanTopic}.`,
          question: `How do you handle the arriving contractors?`,
          choices: [
            {
              text: `Let them assist with non-critical tasks from outside the immediate perimeter.`,
              consequence: `A contractor steps into the active exclusion zone unaware of line-of-fire hazards, creating a critical safety breach.`,
              riskDelta: 40,
              correct: false,
              explanation: `All personnel in the work area must have verified orientation and appropriate protective gear without exceptions.`,
            },
            {
              text: `Pause task start, conduct the 2-minute site orientation, and verify full PPE compliance before entry.`,
              consequence: `The contractor team is briefed, correctly equipped, and assists seamlessly with zero safety incidents.`,
              riskDelta: -10,
              correct: true,
              explanation: `Standardized onboarding ensures all personnel share identical hazard awareness and boundary protocols.`,
            },
          ],
        },
      ],
    },
    multimediaConcepts: {
      videoScript: {
        title: `${titlePrefix}: The 60-Second Film`,
        directorNotes: `High-contrast industrial realism with cinematic color grading. Warm amber highlights against cool steel tones. Emphasize sound design: mechanical clicks, focused breathing, and clear decisive voiceover.`,
        scenes: [
          {
            time: "0:00 - 0:10",
            visual: `Wide shot of bustling industrial facility at sunrise. Cut to close-up of worker's focused eyes reflected in safety visor.`,
            audio: `Narrator (VO, warm and grounded): 'Production moves fast. But physics has never compromised for a clock.'`,
          },
          {
            time: "0:10 - 0:25",
            visual: `Dolly shot along the production line. A red light flashes. Hand reaches toward the emergency stop and isolation hasp.`,
            audio: `SFX: Deep heartbeat thump. Narrator: 'In the split second between a shortcut and a protocol...'`,
          },
          {
            time: "0:25 - 0:45",
            visual: `Crisp macro shot of heavy lock engaging with a decisive click. The team exchanges nods of mutual respect.`,
            audio: `SFX: Crisp mechanical *CLICK*. Narrator: '...one choice guarantees you see tomorrow.'`,
          },
          {
            time: "0:45 - 1:00",
            visual: `Worker stepping through front door at home, embraced by family. On-screen typography resolves into bold campaign slogan.`,
            audio: `Music: Reassuring acoustic crescendo. Narrator: 'Never compromise. Every click is a promise kept.'`,
          },
        ],
      },
      audioDrama: {
        title: `Voices of the Shift: The Near-Miss Log`,
        format: `3-Minute Spatial Audio Experience`,
        characters: [`Narrator`, `Lead Tech Alex`, `Foreman Dave`],
        dialogueSnippet: `[SFX: Heavy machinery ambient hum, distant forklift horn]
DAVE (over radio, urgent): Alex, we're backed up five minutes on the transfer. Can we bypass the secondary seal check?
ALEX: Negative Dave. Standard protocol requires zero-pressure confirmation. I'm locking out now.
[SFX: Sharp metal padlock snap, pneumatic hiss releases safely]
DAVE (pauses): ...Understood, Alex. Good call. Let me know when you have green lights.
NARRATOR: Two minutes of patience prevented a 500-PSI rupture. Speak up. Lock in. Protect your crew.`,
      },
      posterConcept: {
        headline: `YOUR PPE IS NOT A BURDEN. IT IS YOUR LIFE.`,
        subheadline: `Zero Compromise for ${cleanTopic}`,
        callToAction: `Inspect with intention. Verify before you step. Protect every shift.`,
        designStyle: `Bold Swiss industrial typography with high-visibility safety orange and slate contrast`,
      },
      socialMicroContent: {
        slackTeamsTip: `💡 **Shift Safety Pulse — ${cleanTopic}:** When production urgency climbs, standard operating procedures are your greatest asset. Take the extra 30 seconds to double-check isolation and verify zero-energy states. Your crew and your family count on it! 🛡️`,
        instagramCarousel: [
          `SLIDE 1: Why the 30-second shortcut is the most expensive mistake in industrial operations.`,
          `SLIDE 2: 78% of critical incidents occur when rushing during shift changeovers.`,
          `SLIDE 3: The 3 Golden Rules: 1) Physical Verification 2) Peer Accountability 3) Stop-Work Authority.`,
          `SLIDE 4: True craftsmanship is doing it right when nobody is watching. Share this with your shift crew today!`,
        ],
        digitalSignageLoop: `ALERT: Standard protocols in effect for ${cleanTopic}. Stop. Verify. Execute with zero harm.`,
      },
      socialPlatforms: {
        linkedin: {
          hook: `Why high-performing industrial leaders treat safety compliance as their ultimate competitive advantage.`,
          body: `In fast-paced industrial environments, speed without verified safety controls is just a countdown to operational downtime. Today we examine the behavioral systems that eliminate near-misses during ${cleanTopic}.`,
          takeaway: `Empowering frontline workers with unquestioned Stop-Work Authority creates resilient, zero-incident operations.`,
          hashtags: ["#SafetyCulture", "#OperationalExcellence", "#BehavioralSafety", "#WorkplaceSafety"],
        },
        facebook: {
          post: `Every shift begins with one non-negotiable goal: ensuring every single teammate returns home healthy and whole. Check out today's toolbox focus on ${cleanTopic}!`,
          callToAction: `Tag a coworker who always keeps the team safe!`,
        },
        xTwitter: {
          thread: [
            `1/4: On high-risk job sites, gravity, pressure, and electricity don't give second chances. Here is what we learned from analyzing near-misses in ${cleanTopic}: 🧵👇`,
            `2/4: Incident root causes rarely stem from complex technical ignorance. 85% come from small, rationalized shortcuts under time pressure.`,
            `3/4: The fix is cultural: Celebrate workers who pause operations to verify safety. Stop-Work Authority is not a delay—it is an investment in human life.`,
            `4/4: Check your gear. Test before touching. Connect with intention. Every click is a promise kept. #SafetyFirst`,
          ],
        },
        instagram: {
          caption: `A 3-second shortcut can cost a lifetime of recovery. Never negotiate with protocol. Double-tap if your team puts safety first! 🛡️⚙️`,
          carouselSlides: [
            `Pressure vs. Protocol: What happens when speed takes over.`,
            `The Physics of Risk: Why equipment never gives warnings.`,
            `The Golden Habit: 3 checks before line initiation.`,
            `The Real Goal: Going home to what matters most.`,
          ],
          reelConcept: `Fast-paced visual match cuts showing gear inspection rituals set to intense cinematic audio crescendo resolving in a worker returning home to their family.`,
        },
        tiktok: {
          hook: `The 1 thing experienced operators NEVER do on the job site... ⚠️`,
          script: `You think skipping a 10-second inspection saves time? Watch what happens when a 500-lb pressure fitting fails because of a missing cotter pin. Experienced pros don't rush—they verify. Protect yourself and your team.`,
          onScreenCues: `[Text overlay: "POV: You think skipping inspection saves time" -> Cut to solid lock engagement]`,
        },
        youtubeShorts: {
          title: `Why Veteran Operators NEVER Skip This 5-Second Check`,
          pacingNotes: `Punchy 0.5s cut transitions, high-contrast visual cues, bold on-screen subtitles`,
          script: `In high-risk work, you don't rise to the occasion—you fall to the level of your safety habits. Here is the exact 3-step check that prevents catastrophic site failures every single day.`,
        },
      },
    },
    knowledgeQuiz: [
      {
        question: `When an unexplained pressure or mechanical variance is observed during task startup, what is the mandatory immediate action?`,
        options: [
          `Continue running while observing readings from the remote panel`,
          `Exercise Stop-Work Authority, isolate the system, and perform physical zero-verification`,
          `Increase throughput to clear possible line resistance`,
          `Wait until the next scheduled shift handover to report it`,
        ],
        correctIndex: 1,
        explanation: `Immediate stop-work and zero-energy physical verification prevents catastrophic failure before energy builds in the system.`,
      },
      {
        question: `Who on the project team holds the authority to halt high-risk work when an unsafe condition is observed?`,
        options: [
          `Only the senior site director`,
          `Only the external government inspector`,
          `Every single employee, contractor, and team member on site without exception`,
          `Only the designated shift safety officer`,
        ],
        correctIndex: 2,
        explanation: `100% Stop-Work Authority is universal. Every individual has the right and duty to pause work if safety is compromised.`,
      },
    ],
  };
}

// Creative Ideation Engine endpoint (Generates 3-5 distinct creative concepts)
app.post("/api/ideate-concepts", async (req, res) => {
  try {
    const { topic, industry, audience } = req.body;
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const fallbackConcepts = generateFallbackConcepts(topic, industry, audience);
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ concepts: fallbackConcepts, mode: "fallback" });
    }

    const systemPrompt = `You are SafetyStory AI Creative Ideation Engine.
Your purpose: Generate between 3 and 5 genuinely distinct, original creative concepts that transform a technical/safety topic into captivating storytelling experiences.

Follow the 9 official creative modes:
1. CINEMATIC (dramatic storytelling, visual imagery, camera directions, cinematic pacing)
2. DOCUMENTARY (realistic narration, factual framing, observational scenes, educational storytelling)
3. EDUCATIONAL (clarity, learning objectives, memorable teaching moments)
4. DRAMATIC (characters, conflict, critical decisions, tension, resolution)
5. FUTURISTIC (sensors, robotics, AI, digital safety systems, speculative vs current reality)
6. INTERACTIVE (decision points: 'What would you do?', choices & consequences)
7. STORYTELLING (classic narrative arc: character, setting, conflict, resolution, lesson)
8. NEWS / INCIDENT REPORT (professional reporting structure, factual framing)

Do NOT generate 5 variations of the same idea. Make each concept genuinely different in tone, format, and emotional angle.`;

    const prompt = `Generate 4 distinct creative concepts for this safety topic:
Topic: "${topic}"
Industry: "${industry || "General Industry"}"
Audience: "${audience || "Frontline Field Crew & Operators"}"

Return a JSON array of 3-5 concept objects with:
- id: string
- title: string
- hook: string (one-line hook)
- coreIdea: string
- emotionalAngle: string
- recommendedFormat: string (one of the 9 creative modes)
- whyEngaging: string (why it could engage this audience)`;

    try {
      const response = await generateWithModelCascade(ai, {
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                hook: { type: Type.STRING },
                coreIdea: { type: Type.STRING },
                emotionalAngle: { type: Type.STRING },
                recommendedFormat: { type: Type.STRING },
                whyEngaging: { type: Type.STRING },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ concepts: parsed, mode: "gemini" });
      }
    } catch (modelErr: any) {
      console.warn("Ideate concepts model error, returning tailored fallback:", modelErr.message || modelErr);
    }

    return res.json({ concepts: fallbackConcepts, mode: "fallback" });
  } catch (err: any) {
    console.error("Error in ideate-concepts:", err);
    return res.json({ concepts: generateFallbackConcepts(req.body.topic, req.body.industry, req.body.audience), mode: "fallback" });
  }
});

// Generate creative campaign endpoint using Gemini
app.post("/api/generate-campaign", async (req, res) => {
  try {
    const { topic, industry, audience, archetype, keyRules, toneModifiers, selectedConcept } = req.body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const fallback = generateFallbackCampaign(topic, industry, audience, archetype, selectedConcept);
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ campaign: fallback, mode: "offline_fallback" });
    }

    const systemPrompt = `You are SafetyStory AI, an expert workplace health and safety creative director and HSE communication strategist.
Your purpose: Transform technical workplace safety rules, hazards, SOPs, and scenario briefs into memorable, engaging, and behaviorally impactful creative safety campaigns.

You MUST produce:
1. High narrative impact and emotional resonance tailored to the chosen creative archetype.
2. Clear, practical, and actionable life-saving safety takeaways.
3. Engaging multi-format learning and communication assets.
4. An interactive branching scenario that tests real-world hazard decisions.
5. High-retention toolbox talk and supervisory leadership guides.`;

    const userPrompt = `Create a complete creative safety campaign for:
- Topic / Safety Scenario: "${topic}"
- Industry: "${industry || "Construction & Rigging"}"
- Target Audience: "${audience || "Frontline Field Crew & Operators"}"
- Creative Archetype: "${archetype || "Cinematic"}"
- Specific Key Rules/Details: "${keyRules || "Crucial life-saving protocols, risk identification, and preventative habits"}"
- Tone Modifiers: "${toneModifiers || "Emotionally grounded, visceral sensory details, actionable safety takeaway"}"
${selectedConcept ? `- Selected Creative Pitch: ${JSON.stringify(selectedConcept)}` : ""}

DELIVERABLES:
1. Campaign Identity (title, slogan, emotional hook, core rule summary, impact metrics).
2. Complete 10-Step Narrative Arc (title, character, setting, hook, initialSituation, conflictOrRisk, criticalDecision, consequence, interventionOrResolution, keyLesson, callToAction, incitingIncident, conflict, turningPoint, resolution, lessonTakeaway).
3. 5-Scene Storyboard with visual descriptions, camera directions, dialogue, image prompts, and video prompts.
4. Supervisor Toolbox Talk (opening hook, 3 discussion points, 4 checklist items, crew pledge).
5. Interactive Decision Scenario with 2 branching choices, consequences, risk deltas, and explanations.
6. Multimedia Suite (60s Film Script, Spatial Audio Drama, Poster Concept, Multi-Platform Social engine).
7. Knowledge Quiz (2-3 questions with safety rationales).`;

    let response: any;
    try {
      response = await generateWithModelCascade(ai, {
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              campaignTitle: { type: Type.STRING },
              slogan: { type: Type.STRING },
              emotionalHook: { type: Type.STRING },
              coreRuleSummary: { type: Type.STRING },
              impactMetrics: {
                type: Type.OBJECT,
                properties: {
                  memorabilityScore: { type: Type.NUMBER },
                  emotionalResonance: { type: Type.NUMBER },
                  clarityScore: { type: Type.NUMBER },
                  actionableImpact: { type: Type.NUMBER },
                },
              },
              narrative: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  character: { type: Type.STRING },
                  setting: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  initialSituation: { type: Type.STRING },
                  conflictOrRisk: { type: Type.STRING },
                  criticalDecision: { type: Type.STRING },
                  consequence: { type: Type.STRING },
                  interventionOrResolution: { type: Type.STRING },
                  keyLesson: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                  incitingIncident: { type: Type.STRING },
                  conflict: { type: Type.STRING },
                  turningPoint: { type: Type.STRING },
                  resolution: { type: Type.STRING },
                  lessonTakeaway: { type: Type.STRING },
                },
              },
              storyboard: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sceneNumber: { type: Type.NUMBER },
                    duration: { type: Type.STRING },
                    location: { type: Type.STRING },
                    characters: { type: Type.STRING },
                    caption: { type: Type.STRING },
                    visualDescription: { type: Type.STRING },
                    action: { type: Type.STRING },
                    dialogue: { type: Type.STRING },
                    cameraAngle: { type: Type.STRING },
                    onScreenText: { type: Type.STRING },
                    soundMusicDirection: { type: Type.STRING },
                    safetyMessage: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    videoPrompt: { type: Type.STRING },
                  },
                },
              },
              toolboxTalk: {
                type: Type.OBJECT,
                properties: {
                  durationMinutes: { type: Type.NUMBER },
                  openingHook: { type: Type.STRING },
                  discussionPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  handsOnChecklist: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  crewPledge: { type: Type.STRING },
                },
              },
              interactiveScenario: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  briefing: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepId: { type: Type.NUMBER },
                        situation: { type: Type.STRING },
                        question: { type: Type.STRING },
                        choices: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              text: { type: Type.STRING },
                              consequence: { type: Type.STRING },
                              riskDelta: { type: Type.NUMBER },
                              correct: { type: Type.BOOLEAN },
                              explanation: { type: Type.STRING },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              multimediaConcepts: {
                type: Type.OBJECT,
                properties: {
                  videoScript: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      directorNotes: { type: Type.STRING },
                      scenes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            time: { type: Type.STRING },
                            visual: { type: Type.STRING },
                            audio: { type: Type.STRING },
                          },
                        },
                      },
                    },
                  },
                  audioDrama: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      format: { type: Type.STRING },
                      characters: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      dialogueSnippet: { type: Type.STRING },
                    },
                  },
                  posterConcept: {
                    type: Type.OBJECT,
                    properties: {
                      headline: { type: Type.STRING },
                      subheadline: { type: Type.STRING },
                      callToAction: { type: Type.STRING },
                      designStyle: { type: Type.STRING },
                    },
                  },
                  socialMicroContent: {
                    type: Type.OBJECT,
                    properties: {
                      slackTeamsTip: { type: Type.STRING },
                      instagramCarousel: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      digitalSignageLoop: { type: Type.STRING },
                    },
                  },
                  socialPlatforms: {
                    type: Type.OBJECT,
                    properties: {
                      linkedin: {
                        type: Type.OBJECT,
                        properties: {
                          hook: { type: Type.STRING },
                          body: { type: Type.STRING },
                          takeaway: { type: Type.STRING },
                          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                      },
                      facebook: {
                        type: Type.OBJECT,
                        properties: {
                          post: { type: Type.STRING },
                          callToAction: { type: Type.STRING },
                        },
                      },
                      xTwitter: {
                        type: Type.OBJECT,
                        properties: {
                          thread: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                      },
                      instagram: {
                        type: Type.OBJECT,
                        properties: {
                          caption: { type: Type.STRING },
                          carouselSlides: { type: Type.ARRAY, items: { type: Type.STRING } },
                          reelConcept: { type: Type.STRING },
                        },
                      },
                      tiktok: {
                        type: Type.OBJECT,
                        properties: {
                          hook: { type: Type.STRING },
                          script: { type: Type.STRING },
                          onScreenCues: { type: Type.STRING },
                        },
                      },
                      youtubeShorts: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          pacingNotes: { type: Type.STRING },
                          script: { type: Type.STRING },
                        },
                      },
                    },
                  },
                },
              },
              knowledgeQuiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.NUMBER },
                    explanation: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });
    } catch (genError: any) {
      console.warn("Cascade generation caught error, returning dynamic campaign fallback:", genError.message || genError);
      return res.json({
        campaign: fallback,
        mode: "error_fallback",
        errorMsg: genError.message || "Model high demand, returned tailored campaign blueprint",
      });
    }

    const text = response?.text || "";
    let parsedCampaign: any;

    try {
      parsedCampaign = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError, text);
      parsedCampaign = fallback;
    }

    // Ensure all critical top-level structures exist
    if (!parsedCampaign.narrative) parsedCampaign.narrative = fallback.narrative;
    if (!parsedCampaign.storyboard || !Array.isArray(parsedCampaign.storyboard)) parsedCampaign.storyboard = fallback.storyboard;
    if (!parsedCampaign.toolboxTalk) parsedCampaign.toolboxTalk = fallback.toolboxTalk;
    if (!parsedCampaign.interactiveScenario) parsedCampaign.interactiveScenario = fallback.interactiveScenario;
    if (!parsedCampaign.multimediaConcepts) parsedCampaign.multimediaConcepts = fallback.multimediaConcepts;
    if (!parsedCampaign.knowledgeQuiz) parsedCampaign.knowledgeQuiz = fallback.knowledgeQuiz;

    parsedCampaign.id = "camp_" + Date.now();
    parsedCampaign.createdAt = new Date().toISOString();
    parsedCampaign.topic = topic;
    parsedCampaign.industry = industry || "General Industry";
    parsedCampaign.audience = audience || "Frontline Team";
    parsedCampaign.archetype = archetype || "Cinematic";

    return res.json({ campaign: parsedCampaign, mode: "gemini_generated" });
  } catch (error: any) {
    console.error("Error generating campaign:", error);
    const fallback = generateFallbackCampaign(
      req.body.topic || "Safety First",
      req.body.industry || "General",
      req.body.audience || "Crew",
      req.body.archetype || "Cinematic",
      undefined
    );
    return res.json({
      campaign: fallback,
      mode: "error_fallback",
      errorMsg: error.message || "Failed to call Gemini API, fallback generated",
    });
  }
});

// Helper to generate a high-contrast safety artwork SVG data URL
function generateSafetyArtworkSVG(prompt: string, aspectRatio?: string): string {
  const cleanPrompt = prompt.replace(/[<>&"]/g, "").slice(0, 120);
  const is16by9 = aspectRatio === "16:9" || !aspectRatio;
  const width = is16by9 ? 960 : 720;
  const height = is16by9 ? 540 : 720;

  // Derive theme accents from prompt keywords
  const isFire = /fire|hot|weld|flame|burn/i.test(cleanPrompt);
  const isElectric = /electric|wire|arc|energy|lockout/i.test(cleanPrompt);
  const isHeight = /height|fall|scaffold|ladder|beam|roof/i.test(cleanPrompt);
  const isChemical = /chemical|spill|fume|gas|toxic|hazard/i.test(cleanPrompt);

  const accentColor = isFire ? "#EF4444" : isElectric ? "#F59E0B" : isHeight ? "#3B82F6" : isChemical ? "#10B981" : "#FF5F1F";
  const iconSymbol = isFire ? "🔥" : isElectric ? "⚡" : isHeight ? "🦺" : isChemical ? "🧪" : "🛡️";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#090D16" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="100%" stop-color="#FF5F1F" />
    </linearGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.07" />
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#grid)" />

  <!-- Industrial Hazard Frame Strip -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.15" rx="6" />
  <line x1="20" y1="65" x2="${width - 20}" y2="65" stroke="${accentColor}" stroke-width="2" stroke-opacity="0.8" />

  <!-- Header Category -->
  <text x="45" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="${accentColor}" letter-spacing="2">SAFETYSTORY AI • PRODUCTION FRAME</text>
  <text x="${width - 45}" y="48" font-family="monospace" font-size="12" font-weight="600" fill="#94A3B8" text-anchor="end">4K CINEMATIC RATIO</text>

  <!-- Central Symbol Badge -->
  <circle cx="${width / 2}" cy="${height / 2 - 25}" r="48" fill="#1E293B" stroke="${accentColor}" stroke-width="2.5" />
  <text x="${width / 2}" y="${height / 2 - 12}" font-size="34" text-anchor="middle">${iconSymbol}</text>

  <!-- Scene Prompt Text -->
  <rect x="60" y="${height - 145}" width="${width - 120}" height="95" rx="6" fill="#0F172A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.1" />
  <text x="${width / 2}" y="${height - 110}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#F8FAFC" text-anchor="middle">
    VISUAL SCENE DIRECTIVE
  </text>
  <text x="${width / 2}" y="${height - 80}" font-family="Georgia, serif" font-style="italic" font-size="13" fill="#CBD5E1" text-anchor="middle">
    "${cleanPrompt}"
  </text>

  <!-- Verification Badge -->
  <rect x="${width / 2 - 110}" y="${height - 42}" width="220" height="22" rx="11" fill="url(#accentGrad)" />
  <text x="${width / 2}" y="${height - 27}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
    ✓ COMPLIANT STORYBOARD ASSET
  </text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Endpoint to generate visual scene illustration using Gemini Image model with robust fallback
app.post("/api/generate-image", async (req, res) => {
  const { prompt, aspectRatio } = req.body;
  const safePrompt = prompt || "Industrial workplace safety and hazard awareness";
  const defaultFallback = generateSafetyArtworkSVG(safePrompt, aspectRatio);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        imageUrl: defaultFallback,
        mode: "svg_vector",
        note: "API Key not configured. High-contrast safety vector generated.",
      });
    }

    // Try standard Imagen image generation model first if available
    try {
      if (typeof (ai.models as any).generateImages === "function") {
        const imgResponse = await (ai.models as any).generateImages({
          model: "imagen-3.0-generate-002",
          prompt: `High quality cinematic photograph, industrial workplace safety: ${safePrompt}`,
          config: {
            numberOfImages: 1,
            aspectRatio: aspectRatio === "16:9" ? "16:9" : "1:1",
          },
        });

        if (imgResponse.generatedImages && imgResponse.generatedImages[0]?.image?.imageBytes) {
          const mime = "image/png";
          const imageUrl = `data:${mime};base64,${imgResponse.generatedImages[0].image.imageBytes}`;
          return res.json({ imageUrl, mode: "imagen_3" });
        }
      }
    } catch (imagenErr: any) {
      console.warn("Imagen generation skipped or quota exceeded:", imagenErr.message || imagenErr);
    }

    // Return the high-res SVG vector illustration fallback with HTTP 200
    return res.json({
      imageUrl: defaultFallback,
      mode: "svg_vector",
      note: "Rendered high-contrast visual storyboard vector.",
    });
  } catch (error: any) {
    console.error("Error in generate-image:", error);
    return res.json({
      imageUrl: defaultFallback,
      mode: "svg_vector",
    });
  }
});

// Endpoint to transform / polish / translate / re-archetype a specific safety story component
app.post("/api/iterate-story", async (req, res) => {
  try {
    const { instruction, context } = req.body;
    if (!instruction) {
      return res.status(400).json({ error: "Instruction is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        result: `[Preview Mode - Connect GEMINI_API_KEY for live updates]\n\nModified version based on: "${instruction}"\n\n${JSON.stringify(context, null, 2).slice(0, 300)}...`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `You are SafetyStory AI Story Editor.
User Instruction: "${instruction}"
Current Content Context:
${JSON.stringify(context, null, 2)}

Provide the improved, updated text or formatted markdown directly, ensuring maximum engagement, clarity, emotional impact, and behavioral safety retention.`,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error iterating story:", error);
    res.status(500).json({ error: error.message || "Iteration failed" });
  }
});

// Vite middleware & Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SafetyStory AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
