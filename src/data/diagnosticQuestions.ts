import { DiagnosticQuestion } from '../types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // 1. Cognitive Processing (Pillar 1 - Sweller, Cowan)
  {
    id: 'cog_overload',
    dimension: 'cognitive_processing',
    subDimension: 'Cognitive Load & Multi-Step Explanations',
    questionType: 'scenario',
    prompt: 'When you are learning an explanation that has multiple complex steps at once (like a multi-part math proof, scientific cycle, or code algorithm), what usually happens?',
    scenarioContext: 'Think of when a lecturer or textbook suddenly introduces 4 or 5 new terms in a single paragraph.',
    evidenceTier: 'Strong',
    citation: 'Sweller (1988), Cognitive Load Theory; Cowan (2001), Working Memory Chunking',
    options: [
      {
        id: 'cog_1_a',
        text: 'I quickly lose track in the middle and have to re-read the whole thing multiple times from the start.',
        scoreImpact: { cognitive_processing: 35, knowledge_acquisition: 40, knowledge_organization: 35, self_regulation: 40, motivation_emotion_identity: 45, environment_behavior: 50, performance_optimization: 35 },
        diagnosticInsight: 'Vulnerable to cognitive overload: working memory gets bottlenecked when too many new elements are processed simultaneously.',
        behaviorType: 'passive'
      },
      {
        id: 'cog_1_b',
        text: 'I pause and externalize: I sketch a quick diagram, write down the steps on paper, or break it into smaller 1-step chunks.',
        scoreImpact: { cognitive_processing: 92, knowledge_acquisition: 85, knowledge_organization: 90, self_regulation: 88, motivation_emotion_identity: 80, environment_behavior: 78, performance_optimization: 86 },
        diagnosticInsight: 'Effective cognitive offloading: frees working memory capacity by organizing intermediate steps onto paper.',
        behaviorType: 'generative'
      },
      {
        id: 'cog_1_c',
        text: 'I try to hold all intermediate values in my head and read faster to push through the confusion.',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 45, knowledge_organization: 45, self_regulation: 45, motivation_emotion_identity: 55, environment_behavior: 50, performance_optimization: 45 },
        diagnosticInsight: 'Working memory strain: unassisted mental buffering often drops crucial constraints.',
        behaviorType: 'passive'
      },
      {
        id: 'cog_1_d',
        text: 'I skip straight to the final formula or conclusion and hope the intermediate steps won\'t be tested.',
        scoreImpact: { cognitive_processing: 40, knowledge_acquisition: 35, knowledge_organization: 30, self_regulation: 35, motivation_emotion_identity: 40, environment_behavior: 45, performance_optimization: 30 },
        diagnosticInsight: 'Avoidance of mental load: leaves a black-box gap that fails when exam questions vary.',
        behaviorType: 'avoidant'
      }
    ],
    explanation: 'Research in Cognitive Load Theory shows that working memory holds only 3-5 items at once. Top learners intentionally offload intermediate steps onto paper.',
    weight: 1.1
  },

  // 2. Knowledge Acquisition (Pillar 2 - Dunlosky et al. 2013, Roediger & Karpicke 2006)
  {
    id: 'acq_retrieval_strat',
    dimension: 'knowledge_acquisition',
    subDimension: 'Retrieval Practice vs. Rereading',
    questionType: 'scenario',
    prompt: 'You studied a core syllabus topic two days ago. Today you sit down to review it. What is your very first move?',
    scenarioContext: 'This reveals whether you reinforce memory by retrieval or by passive visual familiarity.',
    evidenceTier: 'Strong',
    citation: 'Dunlosky et al. (2013), Improving Students\' Learning; Roediger & Karpicke (2006)',
    options: [
      {
        id: 'acq_1_a',
        text: 'I open my notebook or slides immediately and re-read the highlighted sentences until the topic feels familiar again.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 32, knowledge_organization: 45, self_regulation: 38, motivation_emotion_identity: 50, environment_behavior: 50, performance_optimization: 35 },
        diagnosticInsight: 'Passive recognition reliance: feels smooth and easy, but builds very little long-term recall durability.',
        behaviorType: 'passive'
      },
      {
        id: 'acq_1_b',
        text: 'Before opening any notes, I take a blank sheet and force myself to write down or explain the main ideas purely from memory.',
        scoreImpact: { cognitive_processing: 88, knowledge_acquisition: 95, knowledge_organization: 88, self_regulation: 92, motivation_emotion_identity: 85, environment_behavior: 80, performance_optimization: 90 },
        diagnosticInsight: 'Closed-book retrieval practice: the gold standard of memory durability. Signals high active retention instinct.',
        behaviorType: 'active_retrieval'
      },
      {
        id: 'acq_1_c',
        text: 'I re-watch an online video summary or listen to a recorded lecture on 1.5x speed.',
        scoreImpact: { cognitive_processing: 52, knowledge_acquisition: 45, knowledge_organization: 50, self_regulation: 45, motivation_emotion_identity: 60, environment_behavior: 55, performance_optimization: 45 },
        diagnosticInsight: 'Secondary passive ingestion: enjoyable, but recognition does not equal test-day retrieval.',
        behaviorType: 'passive'
      },
      {
        id: 'acq_1_d',
        text: 'I jump straight to solving 2-3 practice questions first, and only open my notes to check what I got wrong.',
        scoreImpact: { cognitive_processing: 82, knowledge_acquisition: 88, knowledge_organization: 82, self_regulation: 88, motivation_emotion_identity: 78, environment_behavior: 75, performance_optimization: 88 },
        diagnosticInsight: 'Targeted practice testing: highly effective low-stakes retrieval with immediate corrective feedback.',
        behaviorType: 'active_retrieval'
      }
    ],
    explanation: 'Decades of cognitive science demonstrate that pulling information OUT of memory (retrieval) strengthens neural connections far more than putting it IN again (rereading).',
    weight: 1.3
  },

  // 3. Mini-Performance Retrieval & Calibration Task (Pillars 2 & 4)
  {
    id: 'perf_mini_retrieval',
    dimension: 'knowledge_acquisition',
    subDimension: 'Real-Time Retrieval & Confidence Check',
    questionType: 'mini_performance',
    isMiniPerformance: true,
    prompt: 'Quick Live Recall Check: A hospital triage desk admits patients in the exact order of emergency arrival (First-In, First-Out). Which data structure model does this follow?',
    scenarioContext: 'Notice whether you recalled this instantly or had to guess: FIFO vs. LIFO.',
    evidenceTier: 'Strong',
    citation: 'Roediger & Karpicke (2006); Bjork, Dunlosky & Kornell (2013)',
    correctOptionId: 'perf_1_a',
    options: [
      {
        id: 'perf_1_a',
        text: 'A Queue (FIFO: First-In, First-Out, just like people queuing at a bank counter)',
        scoreImpact: { cognitive_processing: 80, knowledge_acquisition: 90, knowledge_organization: 85, self_regulation: 85, motivation_emotion_identity: 75, environment_behavior: 70, performance_optimization: 85 },
        diagnosticInsight: 'Accurate instant concept retrieval: structural principle correctly identified.',
        behaviorType: 'active_retrieval'
      },
      {
        id: 'perf_1_b',
        text: 'A Stack (LIFO: Last-In, First-Out, like a stack of cafeteria trays)',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 45, knowledge_organization: 50, self_regulation: 45, motivation_emotion_identity: 60, environment_behavior: 55, performance_optimization: 45 },
        diagnosticInsight: 'Inverted recall: confused FIFO queue with LIFO stack order.',
        behaviorType: 'passive'
      },
      {
        id: 'perf_1_c',
        text: 'A Binary Tree structure with left and right child pointers',
        scoreImpact: { cognitive_processing: 40, knowledge_acquisition: 40, knowledge_organization: 45, self_regulation: 40, motivation_emotion_identity: 50, environment_behavior: 50, performance_optimization: 40 },
        diagnosticInsight: 'Overcomplicated guess: reached for a complex keyword rather than the governing rule.',
        behaviorType: 'passive'
      }
    ],
    explanation: 'This live mini-check allows LearnWise to test real recall accuracy against your self-reported confidence.',
    weight: 1.2
  },

  // 4. Knowledge Organization (Pillar 3 - Chi et al. 1981, Schema Theory)
  {
    id: 'org_schema',
    dimension: 'knowledge_organization',
    subDimension: 'Mental Models vs. Disconnected Facts',
    questionType: 'concept_relationship',
    prompt: 'When you are studying for a big exam covering many chapters, how do you keep the different ideas organized in your head?',
    scenarioContext: 'Think of topics with dozens of sub-topics, like organic chemistry, company law, or software algorithms.',
    evidenceTier: 'Moderate',
    citation: 'Chi, Feltovich & Glaser (1981), Categorization and Representation by Experts and Novices',
    options: [
      {
        id: 'org_1_a',
        text: 'I memorize individual definitions and formulas in a linear list, from top of my notes to bottom.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 50, knowledge_organization: 35, self_regulation: 45, motivation_emotion_identity: 50, environment_behavior: 55, performance_optimization: 40 },
        diagnosticInsight: 'Linear compartmentalization: facts sit as isolated islands; hard to connect when questions mix concepts.',
        behaviorType: 'passive'
      },
      {
        id: 'org_1_b',
        text: 'I map out the relationships: what is the foundational principle, what branches off it, and what are the contrasts?',
        scoreImpact: { cognitive_processing: 90, knowledge_acquisition: 88, knowledge_organization: 94, self_regulation: 86, motivation_emotion_identity: 80, environment_behavior: 78, performance_optimization: 90 },
        diagnosticInsight: 'Deep schema modeling: builds an integrated mental graph that allows swift transfer and problem diagnosis.',
        behaviorType: 'generative'
      },
      {
        id: 'org_1_c',
        text: 'I group items strictly by whatever headings and bullet points the lecturer or textbook author provided.',
        scoreImpact: { cognitive_processing: 60, knowledge_acquisition: 62, knowledge_organization: 58, self_regulation: 55, motivation_emotion_identity: 58, environment_behavior: 60, performance_optimization: 55 },
        diagnosticInsight: 'Borrowed external organization: structured on paper, but not yet synthesized into an internal mental model.',
        behaviorType: 'structured'
      }
    ],
    explanation: 'Experts organize knowledge around deep structural principles (why things work), while novices focus on surface labels.',
    weight: 1.1
  },

  // 5. Metacognition & Calibration (Pillar 4 - Bjork, Dunlosky & Kornell 2013)
  {
    id: 'reg_fluency_illusion',
    dimension: 'self_regulation',
    subDimension: 'The Fluency Illusion & Metacognitive Calibration',
    questionType: 'metacognitive',
    prompt: 'When you finish reading a chapter and feel "I understand this completely", how accurately does that feeling predict your performance when you face an exam problem?',
    scenarioContext: 'This checks your calibration: the gap between feeling confident and actually performing.',
    evidenceTier: 'Strong',
    citation: 'Bjork, Dunlosky & Kornell (2013), Self-Regulated Learning: Beliefs, Techniques, and Illusions',
    options: [
      {
        id: 'reg_1_a',
        text: 'Often inaccurate: it feels clear while reading my notes, but on test day I get stuck or surprised by questions.',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 52, knowledge_organization: 50, self_regulation: 35, motivation_emotion_identity: 55, environment_behavior: 55, performance_optimization: 40 },
        diagnosticInsight: 'Metacognitive Fluency Illusion: passive familiarity with the words was mistaken for ability to retrieve and apply.',
        behaviorType: 'passive'
      },
      {
        id: 'reg_1_b',
        text: 'Accurately calibrated: I only claim to understand a topic after I have successfully solved problems without looking at notes.',
        scoreImpact: { cognitive_processing: 88, knowledge_acquisition: 90, knowledge_organization: 86, self_regulation: 95, motivation_emotion_identity: 82, environment_behavior: 80, performance_optimization: 90 },
        diagnosticInsight: 'Calibrated metacognition: realistic self-assessment grounded in concrete performance evidence.',
        behaviorType: 'active_retrieval'
      },
      {
        id: 'reg_1_c',
        text: 'I almost always feel like I don\'t know enough, even when I actually score high on the real exam.',
        scoreImpact: { cognitive_processing: 70, knowledge_acquisition: 70, knowledge_organization: 68, self_regulation: 60, motivation_emotion_identity: 45, environment_behavior: 62, performance_optimization: 65 },
        diagnosticInsight: 'Underconfidence calibration: solid knowledge base, but high friction from impostor doubt.',
        behaviorType: 'structured'
      }
    ],
    explanation: 'Passive reading creates a powerful illusion of competence because the answers are right in front of your eyes.',
    weight: 1.3
  },

  // 6. Metacognition: Error Response & Feedback Integration (Pillars 4 & 7 - Zimmerman, Hattie & Timperley)
  {
    id: 'reg_error_response',
    dimension: 'self_regulation',
    subDimension: 'Error Taxonomy & Feedback Use',
    questionType: 'error_diagnosis',
    prompt: 'When you take a practice quiz or exam and get questions wrong, what is your immediate follow-up process?',
    scenarioContext: 'How you treat mistakes determines whether you repeat them on the final exam.',
    evidenceTier: 'Strong',
    citation: 'Zimmerman (2002), Becoming a Self-Regulated Learner; Hattie & Timperley (2007)',
    options: [
      {
        id: 'reg_2_a',
        text: 'I look at the score, feel annoyed or disappointed, check the correct answers quickly, and tell myself to study harder next time.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 40, knowledge_organization: 45, self_regulation: 32, motivation_emotion_identity: 40, environment_behavior: 45, performance_optimization: 34 },
        diagnosticInsight: 'Emotional reaction without root-cause classification: without categorizing the mistake, the error will recur.',
        behaviorType: 'avoidant'
      },
      {
        id: 'reg_2_b',
        text: 'I diagnose the exact root cause: was it a misread question, careless math slip, missing prerequisite, or concept misunderstanding?',
        scoreImpact: { cognitive_processing: 88, knowledge_acquisition: 90, knowledge_organization: 90, self_regulation: 96, motivation_emotion_identity: 88, environment_behavior: 82, performance_optimization: 95 },
        diagnosticInsight: 'Systematic Error Taxonomy: converts each missed point into a specific, high-leverage improvement protocol.',
        behaviorType: 'structured'
      },
      {
        id: 'reg_2_c',
        text: 'I re-do that exact same question until I get 100% on that specific paper, but don\'t test variations.',
        scoreImpact: { cognitive_processing: 60, knowledge_acquisition: 65, knowledge_organization: 55, self_regulation: 55, motivation_emotion_identity: 62, environment_behavior: 62, performance_optimization: 55 },
        diagnosticInsight: 'Local memorization: solves the specific test question instance without repairing the underlying principle.',
        behaviorType: 'passive'
      }
    ],
    explanation: 'Top students don\'t just count errors—they classify them into root causes (concept gap vs. misreading vs. careless execution).',
    weight: 1.2
  },

  // 7. Motivation, Emotion & Learning Identity (Pillar 5 - Bandura 1997, Ames 1992)
  {
    id: 'mot_effort_resilience',
    dimension: 'motivation_emotion_identity',
    subDimension: 'Self-Efficacy & Productive Friction',
    questionType: 'scenario',
    prompt: 'You encounter a difficult concept in your syllabus. You read it twice, try a problem, and get completely stuck. What thought dominates?',
    scenarioContext: 'This reveals your mindset toward cognitive friction: is difficulty a stop sign or a growth signal?',
    evidenceTier: 'Strong',
    citation: 'Bandura (1997), Self-Efficacy; Ames (1992), Achievement Goal Theory',
    options: [
      {
        id: 'mot_1_a',
        text: '"I must not have a natural talent for this course. Some people just have a math or coding brain."',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 50, knowledge_organization: 50, self_regulation: 45, motivation_emotion_identity: 34, environment_behavior: 45, performance_optimization: 40 },
        diagnosticInsight: 'Fixed ability attribution: treats normal learning friction as proof of personal limitation.',
        behaviorType: 'avoidant'
      },
      {
        id: 'mot_1_b',
        text: '"This friction is normal—my brain is building new connections. I just need a simpler analogy or to find the missing prerequisite."',
        scoreImpact: { cognitive_processing: 82, knowledge_acquisition: 84, knowledge_organization: 82, self_regulation: 88, motivation_emotion_identity: 94, environment_behavior: 84, performance_optimization: 88 },
        diagnosticInsight: 'High academic self-efficacy & mastery orientation: sees friction as productive biological work.',
        behaviorType: 'generative'
      },
      {
        id: 'mot_1_c',
        text: '"I\'ll skip this topic entirely and bet that it won\'t come out in the exam compulsory section."',
        scoreImpact: { cognitive_processing: 40, knowledge_acquisition: 36, knowledge_organization: 36, self_regulation: 35, motivation_emotion_identity: 30, environment_behavior: 40, performance_optimization: 30 },
        diagnosticInsight: 'Defensive syllabus avoidance: leaves structural potholes that cause panic when questions cross topics.',
        behaviorType: 'avoidant'
      }
    ],
    explanation: 'Cognitive effort feels uncomfortable. Recognizing that discomfort as productive neural growth keeps you in the game.',
    weight: 1.1
  },

  // 8. Learning Environment & Behavioral System (Pillar 6 - Gollwitzer 1999, Nigerian Context)
  {
    id: 'env_distraction_shield',
    dimension: 'environment_behavior',
    subDimension: 'Environmental Friction & Distraction Shielding',
    questionType: 'scenario',
    prompt: 'You sit down to study in a realistic daily environment (phone buzzing with WhatsApp, noise in the corridor or hostel, variable power). How is your session set up?',
    scenarioContext: 'Assesses whether you design an environment that protects focus or rely only on willpower.',
    evidenceTier: 'Moderate',
    citation: 'Gollwitzer (1999), Implementation Intentions; Ophir et al. (2009), Distraction Costs',
    options: [
      {
        id: 'env_1_a',
        text: 'I rely on pure willpower, but I constantly find myself checking notifications, social media, or getting sidetracked.',
        scoreImpact: { cognitive_processing: 48, knowledge_acquisition: 45, knowledge_organization: 45, self_regulation: 40, motivation_emotion_identity: 50, environment_behavior: 35, performance_optimization: 40 },
        diagnosticInsight: 'Willpower exhaustion: having notifications in sight forces continuous attentional switching costs.',
        behaviorType: 'passive'
      },
      {
        id: 'env_1_b',
        text: 'I set up low-friction safeguards: phone in another room or on Do Not Disturb, notes downloaded offline, and a 25-minute timer.',
        scoreImpact: { cognitive_processing: 85, knowledge_acquisition: 88, knowledge_organization: 82, self_regulation: 90, motivation_emotion_identity: 82, environment_behavior: 95, performance_optimization: 88 },
        diagnosticInsight: 'Environmental engineering: creates physical and digital barriers to distraction before studying begins.',
        behaviorType: 'structured'
      },
      {
        id: 'env_1_c',
        text: 'I only study late at night (like 1 AM to 4 AM) when everything is quiet, even if it leaves me exhausted during daytime classes.',
        scoreImpact: { cognitive_processing: 60, knowledge_acquisition: 58, knowledge_organization: 55, self_regulation: 60, motivation_emotion_identity: 65, environment_behavior: 58, performance_optimization: 55 },
        diagnosticInsight: 'Circadian debt trade-off: solves environmental noise at the cost of sleep-dependent memory consolidation.',
        behaviorType: 'avoidant'
      }
    ],
    explanation: 'Environment design beats willpower. Creating a frictionless study space protects limited cognitive energy.',
    weight: 1.1
  },

  // 9. Performance Optimization & Near vs Far Transfer (Pillar 7 - Chi et al., Ericsson)
  {
    id: 'perf_transfer_ready',
    dimension: 'performance_optimization',
    subDimension: 'Transfer to Unfamiliar Problems (Far Transfer)',
    questionType: 'application',
    prompt: 'After learning a formula or scientific law, how do you verify that you can actually use it under real exam conditions?',
    scenarioContext: 'This checks whether you test true transfer or merely repeat familiar template problems.',
    evidenceTier: 'Moderate',
    citation: 'Chi et al. (1981); Ericsson et al. (1993), Deliberate Practice on Weak Points',
    options: [
      {
        id: 'perf_2_a',
        text: 'If I can solve the textbook example where the numbers are simply replaced with new values, I consider it mastered.',
        scoreImpact: { cognitive_processing: 55, knowledge_acquisition: 58, knowledge_organization: 50, self_regulation: 50, motivation_emotion_identity: 55, environment_behavior: 55, performance_optimization: 42 },
        diagnosticInsight: 'Surface mimicry / Near-transfer only: breaks down when exam questions rephrase the problem context.',
        behaviorType: 'passive'
      },
      {
        id: 'perf_2_b',
        text: 'I deliberately hunt for questions from past papers or other sources where the principle is disguised in a brand-new scenario.',
        scoreImpact: { cognitive_processing: 90, knowledge_acquisition: 88, knowledge_organization: 92, self_regulation: 90, motivation_emotion_identity: 84, environment_behavior: 80, performance_optimization: 96 },
        diagnosticInsight: 'Deep invariant transfer: extracts the governing rule regardless of surface context. Ready for top-tier exam performance.',
        behaviorType: 'generative'
      },
      {
        id: 'perf_2_c',
        text: 'I memorize the standard steps given by the lecturer and write them down in the same exact sequence.',
        scoreImpact: { cognitive_processing: 50, knowledge_acquisition: 52, knowledge_organization: 45, self_regulation: 45, motivation_emotion_identity: 50, environment_behavior: 55, performance_optimization: 40 },
        diagnosticInsight: 'Procedural rigidity: vulnerable when exam questions change variable names or combine steps.',
        behaviorType: 'passive'
      }
    ],
    explanation: 'Real exam capability requires applying principles to unfamiliar and disguised contexts—not just repeating identical textbook problems.',
    weight: 1.2
  },

  // 10. The Learning-Styles Check (Part VI - Pashler, McDaniel, Rohrer & Bjork 2008)
  {
    id: 'pref_learning_style_check',
    dimension: 'knowledge_acquisition',
    subDimension: 'Format Preference vs. Evidence-Based Strategy',
    questionType: 'preference_check',
    prompt: 'Which explanation format do you personally enjoy most when you are first introduced to a new topic?',
    scenarioContext: 'This captures what you enjoy, while ensuring your study plan uses techniques scientifically proven to work for all brains.',
    evidenceTier: 'Strong',
    citation: 'Pashler, McDaniel, Rohrer & Bjork (2008), Learning Styles: Concepts and Evidence',
    options: [
      {
        id: 'pref_1_a',
        text: 'Visual diagrams, animations, and graphic flowcharts.',
        scoreImpact: { cognitive_processing: 70, knowledge_acquisition: 70, knowledge_organization: 75, self_regulation: 70, motivation_emotion_identity: 75, environment_behavior: 70, performance_optimization: 70 },
        diagnosticInsight: 'Visual presentation preference: great for initial encoding, paired with active retrieval for durability.',
        behaviorType: 'generative'
      },
      {
        id: 'pref_1_b',
        text: 'Clear, step-by-step written text or well-organized bullet notes.',
        scoreImpact: { cognitive_processing: 70, knowledge_acquisition: 70, knowledge_organization: 75, self_regulation: 70, motivation_emotion_identity: 75, environment_behavior: 70, performance_optimization: 70 },
        diagnosticInsight: 'Textual presentation preference: great for detailed definitions, paired with closed-book recall.',
        behaviorType: 'structured'
      },
      {
        id: 'pref_1_c',
        text: 'Worked examples and jumping straight into solving small exercises.',
        scoreImpact: { cognitive_processing: 75, knowledge_acquisition: 78, knowledge_organization: 75, self_regulation: 75, motivation_emotion_identity: 75, environment_behavior: 70, performance_optimization: 78 },
        diagnosticInsight: 'Problem-first preference: high engagement, paired with reflection on underlying rules.',
        behaviorType: 'active_retrieval'
      },
      {
        id: 'pref_1_d',
        text: 'Listening to audio explanations, lectures, or discussing with a study group.',
        scoreImpact: { cognitive_processing: 70, knowledge_acquisition: 70, knowledge_organization: 70, self_regulation: 70, motivation_emotion_identity: 75, environment_behavior: 70, performance_optimization: 70 },
        diagnosticInsight: 'Verbal/auditory preference: great for conversational synthesis and teach-back drills.',
        behaviorType: 'generative'
      }
    ],
    explanation: 'Pashler et al. (2008) proved that tailoring content only to a "learning style" does not boost exam results. Spaced retrieval and active practice work best for everyone!',
    weight: 1.0
  },

  // 11. Practice Structure: Interleaving vs. Blocked Practice (Rohrer & Taylor 2007)
  {
    id: 'acq_interleaving',
    dimension: 'knowledge_acquisition',
    subDimension: 'Mixed Problem Types (Interleaving)',
    questionType: 'self_report',
    prompt: 'When you sit down to practice problems before a test (math, physics, accounting, grammar, coding), how do you order them?',
    scenarioContext: 'Reveals whether you practice in blocks or mix different problem types together.',
    evidenceTier: 'Moderate',
    citation: 'Rohrer & Taylor (2007), The Shuffling of Mathematics Problems Improves Learning',
    options: [
      {
        id: 'acq_3_a',
        text: 'I do 20 of the exact same problem type in a row, until I can do them automatically without thinking.',
        scoreImpact: { cognitive_processing: 55, knowledge_acquisition: 50, knowledge_organization: 50, self_regulation: 50, motivation_emotion_identity: 55, environment_behavior: 55, performance_optimization: 45 },
        diagnosticInsight: 'Blocked practice: feels satisfying in the moment, but doesn\'t train your brain to choose which formula to use on exam day.',
        behaviorType: 'passive'
      },
      {
        id: 'acq_3_b',
        text: 'I mix different types of problems together, so I have to figure out which formula or rule applies to each one.',
        scoreImpact: { cognitive_processing: 88, knowledge_acquisition: 94, knowledge_organization: 90, self_regulation: 88, motivation_emotion_identity: 80, environment_behavior: 78, performance_optimization: 94 },
        diagnosticInsight: 'Interleaved practice: trains discrimination between problem types. Replicates authentic exam conditions.',
        behaviorType: 'generative'
      },
      {
        id: 'acq_3_c',
        text: 'I only solve 1 or 2 practice questions after class, and don\'t do more practice until the week of the test.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 40, knowledge_organization: 40, self_regulation: 40, motivation_emotion_identity: 48, environment_behavior: 45, performance_optimization: 38 },
        diagnosticInsight: 'Massed practice (cramming): temporary short-term spike followed by steep memory decay.',
        behaviorType: 'avoidant'
      }
    ],
    explanation: 'Interleaving (mixing problem types) forces your brain to discriminate which tool to use, dramatically improving exam transfer.',
    weight: 1.1
  },

  // 12. Habit & Implementation Intentions (Pillar 6 - Gollwitzer 1999)
  {
    id: 'env_implementation_intentions',
    dimension: 'environment_behavior',
    subDimension: 'Habit Consistency & Implementation Intentions',
    questionType: 'self_report',
    prompt: 'How do you plan when you will study during your week?',
    scenarioContext: 'Reveals whether your study system runs on explicit triggers or vague hopes.',
    evidenceTier: 'Strong',
    citation: 'Gollwitzer (1999), Implementation Intentions: Strong Effects of Simple Plans',
    options: [
      {
        id: 'env_2_a',
        text: 'I set specific "When-Then" triggers: e.g. "When it is 5:00 PM and I finish lunch, I will sit at my desk and do a 20-minute recall drill."',
        scoreImpact: { cognitive_processing: 82, knowledge_acquisition: 88, knowledge_organization: 80, self_regulation: 92, motivation_emotion_identity: 82, environment_behavior: 96, performance_optimization: 88 },
        diagnosticInsight: 'Implementation intention: locks in execution cues in advance, closing the intention-action gap.',
        behaviorType: 'structured'
      },
      {
        id: 'env_2_b',
        text: 'I have a general intention to study "sometime this evening" whenever I feel like I have enough energy.',
        scoreImpact: { cognitive_processing: 55, knowledge_acquisition: 50, knowledge_organization: 50, self_regulation: 45, motivation_emotion_identity: 55, environment_behavior: 45, performance_optimization: 48 },
        diagnosticInsight: 'Unanchored intention: easily displaced by fatigue, messages, or low willpower at the end of the day.',
        behaviorType: 'passive'
      },
      {
        id: 'env_2_c',
        text: 'I only study when a test or deadline is 2-3 days away and pressure forces me to sit down.',
        scoreImpact: { cognitive_processing: 45, knowledge_acquisition: 42, knowledge_organization: 40, self_regulation: 38, motivation_emotion_identity: 45, environment_behavior: 38, performance_optimization: 40 },
        diagnosticInsight: 'Crisis-driven study loop: constant high cortisol, high cognitive fatigue, and zero spaced consolidation.',
        behaviorType: 'avoidant'
      }
    ],
    explanation: 'Decades of research by Peter Gollwitzer show that "When X happens, I will do Y" plans double the likelihood of studying consistently.',
    weight: 1.1
  }
];
