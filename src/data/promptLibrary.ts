import { PromptItem } from '../types';

export const PLSFR_PROMPT_LIBRARY: PromptItem[] = [
  // 1. Cognitive Capacity
  {
    id: 'p_cog_1',
    category: 'Cognitive Capacity',
    title: 'The Feynman Analogy Bridge',
    plsfrDimension: 'cognitive_processing',
    purpose: 'Translate an abstract, technical principle into a tangible real-world physical analogy.',
    recommendedUse: 'Use immediately after first reading a dense concept to test mental representation.',
    prompt: 'I am trying to learn the concept of [CONCEPT/TOPIC]. Act as an expert cognitive educator. Explain this concept using an intuitive real-world analogy involving everyday objects or situations (e.g. market trade, traffic flow, kitchen cooking). Explicitly identify what corresponds to what, and where the analogy breaks down so I don\'t form misconceptions.',
  },
  {
    id: 'p_cog_2',
    category: 'Cognitive Capacity',
    title: 'Working Memory Offload & Step Deconstruction',
    plsfrDimension: 'cognitive_processing',
    purpose: 'Reduce cognitive overload on multi-step reasoning tasks.',
    recommendedUse: 'When an algorithm, proof, or quantitative problem feels overwhelming.',
    prompt: 'Here is a multi-step problem I need to solve: [PASTE PROBLEM]. Help me isolate and label the sub-goals. Break this into discrete mental stages so I can evaluate one constraint at a time without overloading my working memory.',
  },
  {
    id: 'p_cog_3',
    category: 'Cognitive Capacity',
    title: 'Mental Model Stress Test',
    plsfrDimension: 'cognitive_processing',
    purpose: 'Examine boundary conditions and system invariants.',
    recommendedUse: 'After you think you understand a rule or law.',
    prompt: 'For the principle of [PRINCIPLE], give me three extreme edge cases or inverted conditions. What happens to the system if [PARAMETER] becomes zero or approaches infinity? Help me verify if my mental model holds under strain.',
  },

  // 2. Learning Mechanics
  {
    id: 'p_mec_1',
    category: 'Learning Mechanics',
    title: 'Closed-Book Reconstructive Prompt',
    plsfrDimension: 'knowledge_acquisition',
    purpose: 'Stimulate active retrieval rather than passive re-reading.',
    recommendedUse: 'Before opening your lecture notes or textbook for review.',
    prompt: 'I need to review [TOPIC]. Do not summarize it for me. Instead, give me 3 high-yield conceptual retrieval prompts that force me to reconstruct the core architecture from memory without looking at notes. Wait for my response, then critique my gaps.',
  },
  {
    id: 'p_mec_2',
    category: 'Learning Mechanics',
    title: 'Interleaved Practice Generator',
    plsfrDimension: 'knowledge_acquisition',
    purpose: 'Prevent blocked practice illusions and train category discrimination.',
    recommendedUse: 'When preparing for tests spanning multiple related formulas or algorithms.',
    prompt: 'Create a set of 4 short problem scenarios that randomly mix [TOPIC A], [TOPIC B], and [TOPIC C]. Do not label which problem belongs to which topic. My task will be to first identify which principle applies and why, then outline the solution.',
  },
  {
    id: 'p_mec_3',
    category: 'Learning Mechanics',
    title: 'Spaced Retrieval Schedule Designer',
    plsfrDimension: 'knowledge_acquisition',
    purpose: 'Calculate expanding review intervals based on forgetting curve decay.',
    recommendedUse: 'When starting a 4-6 week exam preparation plan.',
    prompt: 'I have [NUMBER] core concepts to master for [EXAM/COURSE] over the next [NUMBER] weeks. Design a distributed spacing matrix that schedules 1st, 2nd, 3rd, and cumulative reviews, front-loading difficult concepts while interleaving familiar ones.',
  },

  // 3. Knowledge Structure
  {
    id: 'p_str_1',
    category: 'Knowledge Structure',
    title: 'Prerequisite Dependency Tracer',
    plsfrDimension: 'knowledge_organization',
    purpose: 'Uncover hidden prerequisite gaps causing current comprehension blocks.',
    recommendedUse: 'When you are repeatedly failing to understand an advanced concept.',
    prompt: 'I am struggling to grasp [DIFFICULT TOPIC]. Trace backwards: what are the 3 foundational concepts that must be fully understood before this topic makes intuitive sense? For each prerequisite, give me a 1-question diagnostic to test if my foundation is secure.',
  },
  {
    id: 'p_str_2',
    category: 'Knowledge Structure',
    title: 'Concept Contrast & Discrimination Matrix',
    plsfrDimension: 'knowledge_organization',
    purpose: 'Clarify boundary distinctions between easily confused concepts.',
    recommendedUse: 'When two formulas, theorems, or data structures seem interchangeable.',
    prompt: 'Compare and contrast [CONCEPT A] and [CONCEPT B]. Build a clear structural matrix showing: (1) Shared characteristics, (2) Critical divergent conditions, (3) Scenarios where selecting Concept A is superior to Concept B, and vice versa.',
  },
  {
    id: 'p_str_3',
    category: 'Knowledge Structure',
    title: 'Macro-Micro Schema Tree',
    plsfrDimension: 'knowledge_organization',
    purpose: 'Situate isolated details into an overarching disciplinary hierarchy.',
    recommendedUse: 'At the start or end of a textbook chapter or lecture module.',
    prompt: 'Here is my course topic: [TOPIC]. Map this into a 3-level schema tree: Level 1 (Governing Domain Law/Problem), Level 2 (Core Structural Mechanisms), Level 3 (Specific Edge Instances & Mathematical/Syntactic Details).',
  },

  // 4. Metacognition & Self-Regulation
  {
    id: 'p_met_1',
    category: 'Metacognition',
    title: 'Overconfidence Audit & Illusion of Fluency Check',
    plsfrDimension: 'self_regulation',
    purpose: 'Detect the gap between recognition familiarity and independent execution.',
    recommendedUse: 'When you feel 100% confident simply because you just re-read the notes.',
    prompt: 'I feel very confident about [TOPIC]. Act as a strict, impartial examiner. Present me with a subtle trick question or disguised problem on this topic that exposes whether I have genuine deep operational mastery or merely superficial recognition familiarity.',
  },
  {
    id: 'p_met_2',
    category: 'Metacognition',
    title: 'Error Taxonomy & Root-Cause Classifier',
    plsfrDimension: 'self_regulation',
    purpose: 'Convert mistakes into systematic diagnostic feedback.',
    recommendedUse: 'After getting an answer incorrect on a practice problem.',
    prompt: 'I got this question wrong: [QUESTION]. My answer was: [MY ANSWER]. The correct answer was: [CORRECT ANSWER]. Help me classify this error into: (a) Misreading of constraints, (b) Missing prerequisite definition, (c) Conceptual misunderstanding of the mechanism, or (d) Calculation/careless execution. Suggest the exact micro-intervention to avoid repeating it.',
  },
  {
    id: 'p_met_3',
    category: 'Metacognition',
    title: 'Study Strategy ROI Reflection',
    plsfrDimension: 'self_regulation',
    purpose: 'Audit your study habits for high-yield cognitive return.',
    recommendedUse: 'During weekly reflection sessions.',
    prompt: 'Review my past week\'s study approach: I spent [HOURS] hours doing [STUDY ACTIVITIES]. Based on cognitive science, evaluate the return-on-time-invested for these activities. Which should I eliminate, reduce, or substitute with active retrieval and transfer practice?',
  },

  // 5. Motivation & Identity
  {
    id: 'p_mot_1',
    category: 'Motivation & Identity',
    title: 'Cognitive Friction Reframer',
    plsfrDimension: 'motivation_emotion_identity',
    purpose: 'Reframe intense learning difficulty as synaptic growth rather than personal limitation.',
    recommendedUse: 'When feeling demoralized by a difficult syllabus topic.',
    prompt: 'I have tried to understand [TOPIC] three times today and still feel completely lost. I am starting to feel like I am not smart enough for this subject. As a cognitive psychologist and mentor, explain the neurobiology of productive struggle and guide me through one gentle recalibration step.',
  },
  {
    id: 'p_mot_2',
    category: 'Motivation & Identity',
    title: 'Exam Anxiety De-Escalation & Cognitive Anchoring',
    plsfrDimension: 'motivation_emotion_identity',
    purpose: 'Manage test performance anxiety through structured protocol.',
    recommendedUse: 'Before major high-stakes examinations like WAEC, JAMB, or finals.',
    prompt: 'I am experiencing high anxiety regarding my upcoming [EXAM] in [SUBJECT]. Give me a 3-minute cognitive grounding protocol: how to steady working memory, re-interpret physiological arousal as readiness, and systematically approach the first 5 minutes of the exam paper.',
  },

  // 6. Environment & Habits
  {
    id: 'p_env_1',
    category: 'Environment & Habits',
    title: 'Hostel / Low-Bandwidth Study System Design',
    plsfrDimension: 'environment_behavior',
    purpose: 'Design friction-resistant study protocols for real Nigerian student realities.',
    recommendedUse: 'When noise, power cuts, or data constraints disrupt consistency.',
    prompt: 'I am studying in a Nigerian university hostel/home setting with unpredictable NEPA power, noise, and limited internet data. Help me design a 2-hour high-efficiency study session that is completely offline-resilient, divides tasks into quiet/noisy environmental phases, and minimizes digital battery drain.',
  },
  {
    id: 'p_env_2',
    category: 'Environment & Habits',
    title: 'Contextual Cue & Distraction Friction Protocol',
    plsfrDimension: 'environment_behavior',
    purpose: 'Engineer the physical and digital study environment to make focus effortless.',
    recommendedUse: 'When phone notifications and context-switching derail study sessions.',
    prompt: 'Analyze my study workstation and habits: [DESCRIBE SETUP]. Give me 4 concrete physical and digital friction adjustments that will stop me from mindlessly checking WhatsApp, Twitter, or TikTok without relying on willpower.',
  },

  // 7. Learning Execution
  {
    id: 'p_exe_1',
    category: 'Learning Execution',
    title: 'High-Fidelity Application Challenge Generator',
    plsfrDimension: 'performance_optimization',
    purpose: 'Create authentic real-world scenarios to test knowledge transfer.',
    recommendedUse: 'After you have successfully recalled definitions and solved textbook examples.',
    prompt: 'Generate an authentic, real-world case study or application problem in [FIELD/SUBJECT] where the principle of [CONCEPT] must be used. Contextualize it within a Nigerian or West African industry challenge (e.g. telecommunications, banking fintech, public health, power grid, agricultural supply).',
  },
  {
    id: 'p_exe_2',
    category: 'Learning Execution',
    title: 'Exam Question Inversion & Question Writer Mode',
    plsfrDimension: 'performance_optimization',
    purpose: 'Step into the exam maker\'s shoes to understand grading rubrics and traps.',
    recommendedUse: 'When preparing for past question drills.',
    prompt: 'Assume you are the chief examiner setting the final exam for [COURSE]. Write 2 challenging, multi-part exam questions on [TOPIC]. Include: (1) The question, (2) The marking scheme/points allocation, (3) The specific trap or pitfall where 70% of students will lose marks.',
  },
];
