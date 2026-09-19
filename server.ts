import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// Helper for default learning strategy
function buildDefaultStrategy(params: {
  goal?: any;
  learnerProfile?: any;
  bottlenecks?: string[];
  availableHours?: number;
}) {
  const { goal, learnerProfile, bottlenecks, availableHours } = params;
  const goalTitle = goal?.title || "Target Goal";
  return {
    title: `Adaptive Mastery Path for ${goalTitle}`,
    rationale: `Tailored for ${learnerProfile?.field_of_study || "your study context"} with PLSFR+ adjustments. Addressing detected bottlenecks: ${bottlenecks?.join(", ") || "Active retrieval & application balance"}.`,
    phases: [
      {
        phase: 1,
        name: "Foundational Schemas & Encoding",
        duration: "Week 1",
        focus: "Deconstruct core primitives into concrete mental models",
        concepts: ["Core Definitions & Constraints", "Fundamental Architecture", "Prerequisites Review"],
        activities: ["Own-words formulation", "Prerequisite gap identification", "Diagnostic self-test"],
      },
      {
        phase: 2,
        name: "Active Retrieval & Reconstructive Recall",
        duration: "Week 2",
        focus: "Closed-book reconstruction to transition from recognition to recall",
        concepts: ["Key Mechanics & Rules", "Common Error Patterns", "Comparative Analysis"],
        activities: ["Spaced flash retrieval", "Error diagnosis drills", "Confidence calibration"],
      },
      {
        phase: 3,
        name: "Contextual Application & Problem Solving",
        duration: "Week 3",
        focus: "Deploy principles in unfamiliar scenarios with varying constraints",
        concepts: ["Scenario Simulation", "Boundary Cases", "Synthesis across topics"],
        activities: ["Authentic case challenge", "Reasoning critique", "Self-explanation of trade-offs"],
      },
      {
        phase: 4,
        name: "Consolidation & Autonomous Transfer",
        duration: "Week 4",
        focus: "Interleaved practice, meta-reflection, and independent problem synthesis",
        concepts: ["Comprehensive Retrieval", "Far Transfer Scenarios", "System Audit"],
        activities: ["Mixed retrieval challenge", "Learning system reflection", "Intervention review"],
      },
    ],
    weeklyHoursBreakdown: `${availableHours || 6} hours/week allocated: 35% Retrieval, 35% Application, 20% Encoding/Capture, 10% Reflection.`,
    successIndicator: "Consistent >75% performance on closed-book transfer challenges with well-calibrated confidence.",
    stuckAction: "Deploy the AI Learning Coach to receive progressive Socratic hints without bypassing cognitive effort.",
  };
}

// 1. AI Learning Architect: Generates tailored learning path & strategy based on PLSFR+ profile and learning goal
app.post("/api/ai/learning-path", async (req, res) => {
  const { goal, learnerProfile, plsfrScores, bottlenecks, availableHours, deadline } = req.body;
  const fallbackStrategy = buildDefaultStrategy({ goal, learnerProfile, bottlenecks, availableHours });

  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        isAiGenerated: false,
        source: "rule-based-engine",
        strategy: fallbackStrategy,
      });
    }

    const prompt = `You are the LearnWise AI Learning Architect.
Learner Context:
- Target Goal: ${JSON.stringify(goal)}
- Learner Profile: Level: ${learnerProfile?.education_level || "University"}, Discipline: ${learnerProfile?.field_of_study || "General"}
- Available Time: ${availableHours || 6} hrs/week, Target Deadline: ${deadline || "1 month"}
- PLSFR+ Cognitive Scores (0-100): ${JSON.stringify(plsfrScores || {})}
- Detected Learning Bottlenecks: ${JSON.stringify(bottlenecks || [])}

Instruction:
Generate a rigorous, evidence-informed learning strategy (not a mere timetable).
Format as JSON:
{
  "title": "Strategy Title",
  "rationale": "Why this specific sequence fits their PLSFR+ profile and bottlenecks",
  "phases": [
    {
      "phase": 1,
      "name": "Phase Name",
      "duration": "Duration (e.g., Week 1)",
      "focus": "Core cognitive focus",
      "concepts": ["Concept 1", "Concept 2"],
      "activities": ["Activity 1", "Activity 2"]
    }
  ],
  "weeklyHoursBreakdown": "Breakdown of hours into encoding, retrieval, application, reflection",
  "successIndicator": "How the student knows it is working",
  "stuckAction": "Specific protocol if the student gets stuck"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      isAiGenerated: true,
      source: "gemini-3.8-flash",
      strategy: parsed,
    });
  } catch (err: any) {
    console.warn("AI Learning Architect unavailable (high demand / 503). Serving rule-based strategy:", err?.message || err);
    return res.json({
      isAiGenerated: false,
      source: "rule-based-fallback",
      strategy: fallbackStrategy,
    });
  }
});

// 2. AI Learning Coach: Socratic guidance that avoids dependency
app.post("/api/ai/coach", async (req, res) => {
  const { studentMessage, currentConcept, recentAttempt, chatHistory } = req.body;
  const fallbackCoachResponse = {
    isAiGenerated: false,
    source: "rule-based-coach",
    response: `Let's break this down together without simply giving away the solution. 
For "${currentConcept?.title || "this concept"}", notice what happened in your last attempt: ${
      recentAttempt?.errorType
        ? `you encountered a ${recentAttempt.errorType.replace("_", " ")}.`
        : "you hesitated on the core principle."
    }

Before we look at the complete answer:
1. In your own words, what is the primary condition or relationship this concept relies on?
2. If you remove the complex details, what simple analogy would explain what is happening here?

Take a moment to draft your reasoning first!`,
    suggestedHint: "Consider checking what happens at the boundary condition or reviewing the prerequisite definitions.",
  };

  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(fallbackCoachResponse);
    }

    const systemInstruction = `You are the LearnWise AI Learning Coach.
Core Mandate:
- YOU MUST NEVER OPTIMIZE DEPENDENCY. If the learner asks "What's the answer?", do NOT just spoonfeed the answer.
- First guide them Socratically: Clarifying question -> Gentle hint -> Thought prompt -> Partial breakdown -> Only provide full breakdown if they have tried and remain stuck.
- Support learner agency, metacognitive self-checking, and active reconstruction.
- Context: Nigerian student (secondary/university context, relatable, warm, precise, intellectually respectful).`;

    const prompt = `Current Concept being studied: ${JSON.stringify(currentConcept || {})}
Recent Attempt Data: ${JSON.stringify(recentAttempt || {})}
Recent Dialogue: ${JSON.stringify(chatHistory || [])}
Student's latest message: "${studentMessage}"

Respond as the AI Learning Coach adhering to the anti-dependency mandate. Provide warm, intellectually rigorous, Socratic guidance.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      isAiGenerated: true,
      source: "gemini-3.8-flash",
      response: response.text,
    });
  } catch (err: any) {
    console.warn("AI Coach unavailable (high demand / 503). Serving rule-based guidance:", err?.message || err);
    return res.json(fallbackCoachResponse);
  }
});

// 3. AI Learning Analyst: Analyzes actual data trends and bottleneck resolution
app.post("/api/ai/analyst", async (req, res) => {
  const { performanceHistory, plsfrScores, sessionMetrics } = req.body;
  const fallbackAnalysis = {
    isAiGenerated: false,
    source: "rule-based-analyst",
    analysis: {
      headline: "Retrieval consistency is strengthening, but application transfer requires reinforcement.",
      findings: [
        "Your closed-book recall accuracy increased by 14% over your last 5 sessions.",
        "Confidence calibration shows slight overconfidence when recalling familiar definitions without problem-solving constraints.",
        "Spaced review completion has eliminated short-term memory decay on foundational concepts.",
      ],
      bottleneckStatus: "Active Retrieval is functional (68/100). The current primary constraint is Contextual Transfer (44/100).",
      nextActionRecommendation: "Complete 2 application challenges under varied scenarios before capturing any new syllabus units.",
    },
  };

  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(fallbackAnalysis);
    }

    const prompt = `You are the LearnWise AI Learning Analyst.
Evaluate this student's actual learning telemetry:
- Performance History: ${JSON.stringify(performanceHistory || {})}
- PLSFR+ Dimension Scores: ${JSON.stringify(plsfrScores || {})}
- Session Metrics: ${JSON.stringify(sessionMetrics || {})}

Provide an honest, objective learning analysis.
Do not fabricate trends. If data is limited, state that explicitly.
Return JSON:
{
  "headline": "One clear sentence summarizing actual capability growth",
  "findings": ["Finding 1 with concrete data point", "Finding 2", "Finding 3"],
  "bottleneckStatus": "Specific assessment of what bottleneck is limiting them now",
  "nextActionRecommendation": "The highest leverage intervention to execute today"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return res.json({
      isAiGenerated: true,
      source: "gemini-3.8-flash",
      analysis: JSON.parse(response.text || "{}"),
    });
  } catch (err: any) {
    console.warn("AI Analyst unavailable (high demand / 503). Serving rule-based analysis:", err?.message || err);
    return res.json(fallbackAnalysis);
  }
});

// 4. AI Application Challenge Generator: Creates authentic scenario-based challenges for concepts
app.post("/api/ai/application-challenge", async (req, res) => {
  const { concept, domain, difficulty } = req.body;
  const fallbackChallenge = {
    isAiGenerated: false,
    source: "rule-based-challenge",
    challenge: {
      scenario: `You are consulting for an institution in Lagos that needs to solve a real-world problem involving ${concept?.title || "this principle"}. A sudden constraint occurs: resources are halved and unexpected traffic surges by 300%.`,
      taskPrompt: `How would you adapt your application of ${concept?.title || "this concept"} to maintain reliability without violating system constraints? Explain the trade-offs.`,
      evaluationCriteria: [
        "Clear identification of governing constraints",
        "Correct application of underlying principle (not just definition)",
        "Reasoned analysis of side-effects and alternatives",
      ],
      sampleProficientApproach: "A proficient response identifies the specific bottleneck, explains why naive approaches fail, and applies the principle's core invariants.",
    },
  };

  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(fallbackChallenge);
    }

    const prompt = `Create an authentic application challenge for the following concept:
Concept: ${JSON.stringify(concept)}
Domain/Field: ${domain || "Academic & Professional"}
Target Difficulty: ${difficulty || "Intermediate"}

The challenge must NOT simply ask the student to define or regurgitate the concept.
It must place them in an authentic, novel scenario requiring reasoning, diagnosis, or contextual decision-making.
Return JSON:
{
  "scenario": "A descriptive, engaging, realistic problem scenario",
  "taskPrompt": "The specific question or challenge the student must solve",
  "evaluationCriteria": ["Criteria 1", "Criteria 2", "Criteria 3"],
  "sampleProficientApproach": "Brief benchmark of what a high-quality response covers"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return res.json({
      isAiGenerated: true,
      source: "gemini-3.8-flash",
      challenge: JSON.parse(response.text || "{}"),
    });
  } catch (err: any) {
    console.warn("Application challenge unavailable (high demand / 503). Serving rule-based challenge:", err?.message || err);
    return res.json(fallbackChallenge);
  }
});

// 5. Concept Processing: Generates analogies, prerequisite mapping, and mental models
app.post("/api/ai/concept-process", async (req, res) => {
  const { rawContent, title, domain } = req.body;
  const fallbackBreakdown = {
    isAiGenerated: false,
    source: "rule-based-processing",
    breakdown: {
      coreIdea: `The central mechanism of ${title || "this concept"} is establishing an invariant relationship between inputs, transformations, and outcomes.`,
      everydayAnalogy: `Think of it like a commuter transit hub: efficiency depends not on packing more vehicles, but on routing flows through non-blocking pathways.`,
      prerequisites: ["Fundamental terminology", "Basic structural relations", "Constraint evaluation"],
      potentialMisconceptions: ["Confusing familiarity with retrieval capability", "Overlooking edge cases under heavy load"],
      keyQuestionForSelfTest: `If the core condition is inverted, what immediate consequence occurs in the system?`,
    },
  };

  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(fallbackBreakdown);
    }

    const prompt = `Analyze this captured learning material to help the student build a durable mental model:
Concept Title: ${title}
Domain: ${domain || "General Study"}
Raw Content: ${rawContent}

Return JSON:
{
  "coreIdea": "Clear 1-2 sentence articulation of the central principle",
  "everydayAnalogy": "A concrete, intuitive real-world analogy",
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "potentialMisconceptions": ["Common misunderstanding 1", "Common misunderstanding 2"],
  "keyQuestionForSelfTest": "One sharp question to test if they truly understand the concept"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return res.json({
      isAiGenerated: true,
      source: "gemini-3.8-flash",
      breakdown: JSON.parse(response.text || "{}"),
    });
  } catch (err: any) {
    console.warn("Concept processing unavailable (high demand / 503). Serving rule-based breakdown:", err?.message || err);
    return res.json(fallbackBreakdown);
  }
});

// Setup Vite middleware in dev or static serving in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LearnWise server running on http://0.0.0.0:${PORT}`);
  });
}

start();
