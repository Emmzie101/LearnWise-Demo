import { DiagnosticQuestion } from '../types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // 1. Cognitive Processing System
  {
    id: 'cog_1',
    dimension: 'cognitive_processing',
    subDimension: 'Encoding & Mental Representation',
    questionType: 'scenario',
    prompt: 'You are presented with a brand new, complex principle in your course. What is your very first mental move?',
    scenarioContext: 'Suppose you have just received a dense 10-page lecture handout or technical chapter.',
    options: [
      {
        id: 'cog_1_a',
        text: 'I read through it repeatedly with a highlighter until the wording feels familiar.',
        scoreImpact: { cognitive_processing: 35, knowledge_acquisition: 30, knowledge_organization: 30, self_regulation: 35, motivation_emotion_identity: 50, environment_behavior: 50, performance_optimization: 30 },
        diagnosticInsight: 'Passive recognition trap: high visual familiarity without deep structural encoding.',
      },
      {
        id: 'cog_1_b',
        text: 'I write down a detailed word-for-word summary into my notebook.',
        scoreImpact: { cognitive_processing: 55, knowledge_acquisition: 50, knowledge_organization: 50, self_regulation: 45, motivation_emotion_identity: 55, environment_behavior: 60, performance_optimization: 45 },
        diagnosticInsight: 'Transcriptive encoding: creates external record but doesn\'t test internal mental model.',
      },
      {
        id: 'cog_1_c',
        text: 'I immediately try to re-explain the core idea in my own plain words and link it to an analogy I already understand.',
        scoreImpact: { cognitive_processing: 88, knowledge_acquisition: 82, knowledge_organization: 85, self_regulation: 78, motivation_emotion_identity: 75, environment_behavior: 70, performance_optimization: 80 },
        diagnosticInsight: 'Generative encoding: builds relational bridges to prior schemas.',
      },
      {
        id: 'cog_1_d',
        text: 'I scan for practice questions first to see what the exam will ask before reading.',
        scoreImpact: { cognitive_processing: 72, knowledge_acquisition: 75, knowledge_organization: 65, self_regulation: 80, motivation_emotion_identity: 70, environment_behavior: 65, performance_optimization: 75 },
        diagnosticInsight: 'Goal-directed framing: primes attention for target test features.',
      },
    ],
    explanation: 'Durable encoding requires generative processing—translating abstract information into personal analogies and structural relationships.',
    weight: 1.2,
  },
  {
    id: 'cog_2',
    dimension: 'cognitive_processing',
    subDimension: 'Working Memory Management',
    questionType: 'self_report',
    prompt: 'When tackling multi-step quantitative or logical problems, how do you handle complex working steps?',
    options: [
      {
        id: 'cog_2_a',
        text: 'I try to hold most intermediate numbers or conditions in my head to solve it faster.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 50, knowledge_organization: 40, self_regulation: 40, motivation_emotion_identity: 55, environment_behavior: 50, performance_optimization: 45 },
        diagnosticInsight: 'Cognitive overload vulnerability: unassisted working memory easily leaks state.',
      },
      {
        id: 'cog_2_b',
        text: 'I externalize: I diagram the problem state, write down intermediate constraints, and isolate sub-goals.',
        scoreImpact: { cognitive_processing: 90, knowledge_acquisition: 80, knowledge_organization: 88, self_regulation: 85, motivation_emotion_identity: 75, environment_behavior: 75, performance_optimization: 85 },
        diagnosticInsight: 'Effective cognitive offloading: maximizes available working memory for reasoning.',
      },
      {
        id: 'cog_2_c',
        text: 'I look at the worked example solution first and follow its exact steps line by line.',
        scoreImpact: { cognitive_processing: 60, knowledge_acquisition: 55, knowledge_organization: 58, self_regulation: 50, motivation_emotion_identity: 50, environment_behavior: 55, performance_optimization: 52 },
        diagnosticInsight: 'Template dependency: relies on external scaffolding rather than internal constraint mapping.',
      },
    ],
    explanation: 'Expert learners intentionally offload transient state onto paper or diagrams to protect reasoning bandwidth.',
    weight: 1.0,
  },

  // 2. Knowledge Acquisition & Learning Mechanics
  {
    id: 'acq_1',
    dimension: 'knowledge_acquisition',
    subDimension: 'Retrieval vs. Passive Exposure',
    questionType: 'scenario',
    prompt: 'You completed a 2-hour study session yesterday on a key syllabus topic. You sit down to review it today. What do you do?',
    scenarioContext: 'This reveals whether you practice retrieval or re-reading.',
    options: [
      {
        id: 'acq_1_a',
        text: 'I open my notes or textbook immediately and re-read the chapter to refresh my memory.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 35, knowledge_organization: 45, self_regulation: 40, motivation_emotion_identity: 50, environment_behavior: 50, performance_optimization: 38 },
        diagnosticInsight: 'Passive re-exposure: provides illusion of mastery without retrieval pathway reinforcement.',
      },
      {
        id: 'acq_1_b',
        text: 'Before opening any notes, I take a blank sheet and force myself to recall the core concepts and draw their relationships.',
        scoreImpact: { cognitive_processing: 85, knowledge_acquisition: 92, knowledge_organization: 88, self_regulation: 90, motivation_emotion_identity: 80, environment_behavior: 75, performance_optimization: 88 },
        diagnosticInsight: 'Closed-book free recall: robustly stimulates synaptic reconsolidation.',
      },
      {
        id: 'acq_1_c',
        text: 'I read through a friend\'s summary or watch a short YouTube summary video.',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 45, knowledge_organization: 50, self_regulation: 45, motivation_emotion_identity: 60, environment_behavior: 55, performance_optimization: 45 },
        diagnosticInsight: 'Secondary passive ingestion: feels engaging but creates low personal recall durability.',
      },
      {
        id: 'acq_1_d',
        text: 'I quickly test myself on 2-3 practice questions, check what I missed, and then look up only those specific gaps.',
        scoreImpact: { cognitive_processing: 80, knowledge_acquisition: 86, knowledge_organization: 80, self_regulation: 85, motivation_emotion_identity: 75, environment_behavior: 70, performance_optimization: 85 },
        diagnosticInsight: 'Targeted retrieval testing: high return on effort with targeted error correction.',
      },
    ],
    explanation: 'Testing and closed-book retrieval strengthen neural pathways far more than additional re-reading.',
    weight: 1.3,
  },
  {
    id: 'acq_2',
    dimension: 'knowledge_acquisition',
    subDimension: 'Spaced Scheduling',
    questionType: 'self_report',
    prompt: 'How do you schedule your study intervals before major tests or exams?',
    options: [
      {
        id: 'acq_2_a',
        text: 'I study the topic once when introduced, then do an intensive marathon cramming session 48 hours before the exam.',
        scoreImpact: { cognitive_processing: 40, knowledge_acquisition: 32, knowledge_organization: 40, self_regulation: 35, motivation_emotion_identity: 45, environment_behavior: 40, performance_optimization: 35 },
        diagnosticInsight: 'Massed practice (cramming): temporary short-term memory spike followed by steep forgetting curve.',
      },
      {
        id: 'acq_2_b',
        text: 'I space reviews across expanding intervals: review after 1 day, 4 days, 12 days, and before the test.',
        scoreImpact: { cognitive_processing: 82, knowledge_acquisition: 94, knowledge_organization: 85, self_regulation: 92, motivation_emotion_identity: 80, environment_behavior: 85, performance_optimization: 90 },
        diagnosticInsight: 'Distributed spaced practice: counters the Ebbinghaus forgetting curve efficiently.',
      },
      {
        id: 'acq_2_c',
        text: 'I review topics whenever I happen to feel motivated or when a lecturer announces an impromptu test.',
        scoreImpact: { cognitive_processing: 48, knowledge_acquisition: 45, knowledge_organization: 45, self_regulation: 42, motivation_emotion_identity: 50, environment_behavior: 42, performance_optimization: 44 },
        diagnosticInsight: 'Reactive ad-hoc scheduling: leaves retention vulnerable to inconsistent habits.',
      },
    ],
    explanation: 'Spaced distribution converts unstable working memory traces into durable long-term storage.',
    weight: 1.1,
  },

  // 3. Knowledge Organization & Mental Models
  {
    id: 'org_1',
    dimension: 'knowledge_organization',
    subDimension: 'Hierarchies & Prerequisite Mapping',
    questionType: 'concept_relationship',
    prompt: 'When learning a broad syllabus topic, how do you organize the relationship between individual facts?',
    options: [
      {
        id: 'org_1_a',
        text: 'I memorize individual facts, formulas, or definitions in a linear list from top to bottom.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 50, knowledge_organization: 35, self_regulation: 45, motivation_emotion_identity: 50, environment_behavior: 55, performance_optimization: 40 },
        diagnosticInsight: 'Linear compartmentalization: individual facts remain isolated without relational coherence.',
      },
      {
        id: 'org_1_b',
        text: 'I map them as a hierarchy or graph: which concept is the foundation, what depends on what, and how they contrast.',
        scoreImpact: { cognitive_processing: 88, knowledge_acquisition: 84, knowledge_organization: 92, self_regulation: 85, motivation_emotion_identity: 80, environment_behavior: 75, performance_optimization: 88 },
        diagnosticInsight: 'Structural schema modeling: robust mental graph that enables transfer and rapid diagnostic navigation.',
      },
      {
        id: 'org_1_c',
        text: 'I group items strictly by whatever headings the textbook or lecturer used.',
        scoreImpact: { cognitive_processing: 60, knowledge_acquisition: 62, knowledge_organization: 60, self_regulation: 55, motivation_emotion_identity: 55, environment_behavior: 60, performance_optimization: 55 },
        diagnosticInsight: 'Borrowed organization: organized externally, but not yet synthesized into a personal mental model.',
      },
    ],
    explanation: 'True conceptual mastery requires building mental models with clear prerequisite dependencies and relational links.',
    weight: 1.1,
  },

  // 4. Self-Regulation & Metacognitive System
  {
    id: 'reg_1',
    dimension: 'self_regulation',
    subDimension: 'Confidence Calibration & Metacognitive Monitoring',
    questionType: 'metacognitive',
    prompt: 'When you rate your confidence as "I completely understand this topic", how accurately does that predict your performance on an unfamiliar exam problem?',
    options: [
      {
        id: 'reg_1_a',
        text: 'Often inaccurate: I feel very confident when reviewing, but get stuck or surprised when faced with novel questions.',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 52, knowledge_organization: 50, self_regulation: 38, motivation_emotion_identity: 55, environment_behavior: 55, performance_optimization: 42 },
        diagnosticInsight: 'Metacognitive illusion (Overconfidence bias): fluency during reading is mistaken for operational mastery.',
      },
      {
        id: 'reg_1_b',
        text: 'I usually feel underconfident even when I actually end up getting the questions right.',
        scoreImpact: { cognitive_processing: 70, knowledge_acquisition: 68, knowledge_organization: 65, self_regulation: 58, motivation_emotion_identity: 48, environment_behavior: 60, performance_optimization: 62 },
        diagnosticInsight: 'Underconfidence / Impostor friction: creates unnecessary anxiety despite solid cognitive foundation.',
      },
      {
        id: 'reg_1_c',
        text: 'Accurately calibrated: I only claim understanding after successfully generating the solution unassisted under test conditions.',
        scoreImpact: { cognitive_processing: 85, knowledge_acquisition: 86, knowledge_organization: 85, self_regulation: 94, motivation_emotion_identity: 82, environment_behavior: 80, performance_optimization: 90 },
        diagnosticInsight: 'Calibrated metacognition: realistic self-assessment grounded in performance evidence.',
      },
    ],
    explanation: 'Metacognitive calibration ensures you spend effort where knowledge is truly fragile rather than where it merely feels familiar.',
    weight: 1.3,
  },
  {
    id: 'reg_2',
    dimension: 'self_regulation',
    subDimension: 'Error Diagnosis & Feedback Integration',
    questionType: 'error_diagnosis',
    prompt: 'You score 55% on a practice test. What is your exact post-test process?',
    options: [
      {
        id: 'reg_2_a',
        text: 'I look at my score with frustration, check the correct answers quickly, and resolve to study harder next time.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 40, knowledge_organization: 45, self_regulation: 34, motivation_emotion_identity: 40, environment_behavior: 45, performance_optimization: 35 },
        diagnosticInsight: 'Emotional reaction without root-cause categorization: unlikely to change future outcomes.',
      },
      {
        id: 'reg_2_b',
        text: 'I classify every wrong answer: was it a misreading, careless mistake, missing prerequisite, or reasoning failure? Then I address the root cause.',
        scoreImpact: { cognitive_processing: 86, knowledge_acquisition: 88, knowledge_organization: 88, self_regulation: 95, motivation_emotion_identity: 85, environment_behavior: 80, performance_optimization: 94 },
        diagnosticInsight: 'Systematic error taxonomy: converts errors into high-yield learning interventions.',
      },
      {
        id: 'reg_2_c',
        text: 'I re-do the exact same test questions until I can get 100% on that specific paper.',
        scoreImpact: { cognitive_processing: 62, knowledge_acquisition: 65, knowledge_organization: 58, self_regulation: 55, motivation_emotion_identity: 60, environment_behavior: 62, performance_optimization: 56 },
        diagnosticInsight: 'Local overfitting: memorizes specific question instances rather than generalizing the underlying principle.',
      },
    ],
    explanation: 'Systematic error diagnosis prevents recurring failure patterns and identifies specific conceptual bottlenecks.',
    weight: 1.2,
  },

  // 5. Motivation, Emotion & Learning Identity
  {
    id: 'mot_1',
    dimension: 'motivation_emotion_identity',
    subDimension: 'Cognitive Resilience & Effort Framing',
    questionType: 'scenario',
    prompt: 'When you struggle deeply to understand an abstract concept and your first two attempts fail, what thought predominates?',
    options: [
      {
        id: 'mot_1_a',
        text: '"Maybe I\'m just not good at this subject or don\'t have the natural talent for it."',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 50, knowledge_organization: 50, self_regulation: 45, motivation_emotion_identity: 36, environment_behavior: 45, performance_optimization: 40 },
        diagnosticInsight: 'Fixed mindset vulnerability: interprets productive cognitive struggle as evidence of inadequacy.',
      },
      {
        id: 'mot_1_b',
        text: '"This friction means my brain is forming new neural connections; I just need to find the missing prerequisite or try a different angle."',
        scoreImpact: { cognitive_processing: 80, knowledge_acquisition: 80, knowledge_organization: 80, self_regulation: 86, motivation_emotion_identity: 92, environment_behavior: 82, performance_optimization: 88 },
        diagnosticInsight: 'Incremental growth framing: views cognitive difficulty as a productive signal of learning in progress.',
      },
      {
        id: 'mot_1_c',
        text: '"I\'ll skip this topic entirely and hope it doesn\'t appear in the compulsory exam section."',
        scoreImpact: { cognitive_processing: 40, knowledge_acquisition: 38, knowledge_organization: 38, self_regulation: 35, motivation_emotion_identity: 32, environment_behavior: 40, performance_optimization: 30 },
        diagnosticInsight: 'Avoidance coping: leaves critical structural gaps that compound across the syllabus.',
      },
    ],
    explanation: 'Viewing difficulty as productive friction protects emotional resilience and sustains problem-solving persistence.',
    weight: 1.1,
  },

  // 6. Learning Environment & Behavioral Systems
  {
    id: 'env_1',
    dimension: 'environment_behavior',
    subDimension: 'Friction Management & Consistency Protocols',
    questionType: 'scenario',
    prompt: 'You are studying in a typical environment with unpredictable power, noise from roommates or hostel corridors, and frequent phone notifications. How is your study session organized?',
    scenarioContext: 'This assesses whether you design your behavioral environment or rely purely on willpower.',
    options: [
      {
        id: 'env_1_a',
        text: 'I try to use sheer willpower to focus, but frequently get pulled into checking messages or waiting for power.',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 45, knowledge_organization: 45, self_regulation: 40, motivation_emotion_identity: 48, environment_behavior: 35, performance_optimization: 40 },
        diagnosticInsight: 'Willpower depletion: unshielded environment forces constant attention-switching costs.',
      },
      {
        id: 'env_1_b',
        text: 'I set up low-friction safeguards: phone on airplane/focus mode, offline notes downloaded ahead of time, and short 25-minute uninterrupted blocks.',
        scoreImpact: { cognitive_processing: 82, knowledge_acquisition: 85, knowledge_organization: 80, self_regulation: 88, motivation_emotion_identity: 80, environment_behavior: 94, performance_optimization: 86 },
        diagnosticInsight: 'Contextual environment engineering: protects cognitive bandwidth against local disruptions.',
      },
      {
        id: 'env_1_c',
        text: 'I only study late at night (e.g. 1 AM - 4 AM) when everything is quiet, even if I am exhausted during the day.',
        scoreImpact: { cognitive_processing: 60, knowledge_acquisition: 58, knowledge_organization: 55, self_regulation: 60, motivation_emotion_identity: 65, environment_behavior: 58, performance_optimization: 55 },
        diagnosticInsight: 'Circadian debt trade-off: solves environmental noise at the cost of sleep-dependent memory consolidation.',
      },
    ],
    explanation: 'Habitual design and environmental friction reduction beat raw willpower every time.',
    weight: 1.1,
  },

  // 7. Performance Optimization & Continuous Improvement
  {
    id: 'perf_1',
    dimension: 'performance_optimization',
    subDimension: 'Application Transfer & Near vs. Far Problems',
    questionType: 'application',
    prompt: 'After learning a formula or theoretical law, how do you verify that you can actually use it?',
    options: [
      {
        id: 'perf_1_a',
        text: 'If I can solve the textbook example where the numbers are simply replaced with new values, I consider it mastered.',
        scoreImpact: { cognitive_processing: 55, knowledge_acquisition: 58, knowledge_organization: 50, self_regulation: 50, motivation_emotion_identity: 55, environment_behavior: 55, performance_optimization: 44 },
        diagnosticInsight: 'Surface mimicry / Near transfer only: vulnerable when surface story or variable names change.',
      },
      {
        id: 'perf_1_b',
        text: 'I deliberately seek out unfamiliar word problems, mixed questions from other topics, or real-life cases where the principle is disguised.',
        scoreImpact: { cognitive_processing: 88, knowledge_acquisition: 86, knowledge_organization: 90, self_regulation: 88, motivation_emotion_identity: 82, environment_behavior: 80, performance_optimization: 95 },
        diagnosticInsight: 'Deep invariant transfer: extracts the governing rule regardless of surface context.',
      },
      {
        id: 'perf_1_c',
        text: 'I memorize the standard steps given by the teacher and write them down in the same order every time.',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 52, knowledge_organization: 45, self_regulation: 45, motivation_emotion_identity: 50, environment_behavior: 55, performance_optimization: 40 },
        diagnosticInsight: 'Procedural rigidity: fails when steps must be reordered or combined with another principle.',
      },
    ],
    explanation: 'True capability requires applying principles to unfamiliar and disguised contexts—not just identical template practice.',
    weight: 1.2,
  },
];
