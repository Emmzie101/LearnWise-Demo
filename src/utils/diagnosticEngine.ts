import { 
  PlsfrDimension, 
  PlsfrDimensionKey, 
  DiagnosticResponse, 
  DiagnosticReport, 
  Intervention, 
  LearnerProfile,
  DiagnosticContradiction,
  TargetedInterventionItem
} from '../types';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';

/**
 * PLSFR+ Diagnostic & Personalization Engine
 * Grounded in the LearnWise Research Dossier & Technical Blueprint
 */

export function calculateDiagnosticScores(
  responses: DiagnosticResponse[], 
  previousDimensions: PlsfrDimension[]
): { updatedDimensions: PlsfrDimension[]; rawResponseMap: Map<string, string> } {
  const dimensionScoreTotals: Record<PlsfrDimensionKey, { total: number; count: number; performanceCount: number; scenarioCount: number; selfReportCount: number }> = {
    cognitive_processing: { total: 0, count: 0, performanceCount: 0, scenarioCount: 0, selfReportCount: 0 },
    knowledge_acquisition: { total: 0, count: 0, performanceCount: 0, scenarioCount: 0, selfReportCount: 0 },
    knowledge_organization: { total: 0, count: 0, performanceCount: 0, scenarioCount: 0, selfReportCount: 0 },
    self_regulation: { total: 0, count: 0, performanceCount: 0, scenarioCount: 0, selfReportCount: 0 },
    motivation_emotion_identity: { total: 0, count: 0, performanceCount: 0, scenarioCount: 0, selfReportCount: 0 },
    environment_behavior: { total: 0, count: 0, performanceCount: 0, scenarioCount: 0, selfReportCount: 0 },
    performance_optimization: { total: 0, count: 0, performanceCount: 0, scenarioCount: 0, selfReportCount: 0 },
  };

  const rawResponseMap = new Map<string, string>();

  responses.forEach(resp => {
    rawResponseMap.set(resp.questionId, resp.selectedOptionId);
    const question = DIAGNOSTIC_QUESTIONS.find(q => q.id === resp.questionId);
    if (!question) return;
    const option = question.options.find(o => o.id === resp.selectedOptionId);
    if (!option) return;

    Object.entries(option.scoreImpact).forEach(([key, val]) => {
      const dimKey = key as PlsfrDimensionKey;
      if (dimensionScoreTotals[dimKey]) {
        dimensionScoreTotals[dimKey].total += val * question.weight;
        dimensionScoreTotals[dimKey].count += question.weight;

        if (question.questionType === 'mini_performance' || question.questionType === 'recall') {
          dimensionScoreTotals[dimKey].performanceCount += 1;
        } else if (question.questionType === 'scenario' || question.questionType === 'application') {
          dimensionScoreTotals[dimKey].scenarioCount += 1;
        } else {
          dimensionScoreTotals[dimKey].selfReportCount += 1;
        }
      }
    });
  });

  const updatedDimensions: PlsfrDimension[] = previousDimensions.map(d => {
    const recorded = dimensionScoreTotals[d.key];
    let newScore = d.score;
    let confidenceBand: 'Low' | 'Moderate' | 'High' = d.confidenceBand || 'Moderate';
    let numericConfidence = d.confidence;

    if (recorded && recorded.count > 0) {
      newScore = Math.round(recorded.total / recorded.count);
      const totalIndicators = recorded.selfReportCount + recorded.scenarioCount + recorded.performanceCount;

      // Section H & I: Confidence Rating logic
      // High requires at least 3 indicators including a scenario/performance check
      if (totalIndicators >= 3 && (recorded.performanceCount > 0 || recorded.scenarioCount >= 2)) {
        confidenceBand = 'High';
        numericConfidence = Math.min(95, 82 + totalIndicators * 3);
      } else if (totalIndicators >= 2) {
        confidenceBand = 'Moderate';
        numericConfidence = Math.min(78, 65 + totalIndicators * 4);
      } else {
        confidenceBand = 'Low';
        numericConfidence = 50;
      }
    }

    let strength: PlsfrDimension['strengthLevel'] = 'Emerging';
    if (newScore < 42) strength = 'Developing';
    else if (newScore < 58) strength = 'Emerging';
    else if (newScore < 74) strength = 'Functional';
    else if (newScore < 88) strength = 'Strong';
    else strength = 'Highly Developed';

    let risk: PlsfrDimension['riskLevel'] = 'Low';
    if (newScore < 45) risk = 'Elevated';
    else if (newScore < 60) risk = 'Moderate';

    return {
      ...d,
      score: newScore,
      confidence: numericConfidence,
      confidenceBand,
      evidenceCount: (d.evidenceCount ?? 0) + (recorded && recorded.count > 0 ? Math.round(recorded.count) : 0),
      strengthLevel: strength,
      riskLevel: risk,
      evidenceBreakdown: recorded ? {
        selfReportCount: recorded.selfReportCount,
        scenarioCount: recorded.scenarioCount,
        performanceCount: recorded.performanceCount,
        contradictions: []
      } : undefined
    };
  });

  return { updatedDimensions, rawResponseMap };
}

/**
 * Evaluates the Diagnostic Reasoning Engine (Section J)
 * Auditable IF/THEN rules detecting contradictions and interaction patterns
 */
export function generateDiagnosticReport(
  responses: DiagnosticResponse[],
  dimensions: PlsfrDimension[],
  profile: LearnerProfile
): { updatedDimensions: PlsfrDimension[]; report: DiagnosticReport; initialInterventions: Intervention[] } {
  const { updatedDimensions, rawResponseMap } = calculateDiagnosticScores(responses, dimensions);

  // Cross-reference detected responses
  const acqResponse = rawResponseMap.get('acq_retrieval_strat'); // Q2
  const miniPerfResponse = rawResponseMap.get('perf_mini_retrieval'); // Q3
  const fluencyResponse = rawResponseMap.get('reg_fluency_illusion'); // Q5
  const errorResponse = rawResponseMap.get('reg_error_response'); // Q6
  const effortResponse = rawResponseMap.get('mot_effort_resilience'); // Q7
  const envResponse = rawResponseMap.get('env_distraction_shield'); // Q8
  const transferResponse = rawResponseMap.get('perf_transfer_ready'); // Q9
  const prefResponse = rawResponseMap.get('pref_learning_style_check'); // Q10
  const overloadResponse = rawResponseMap.get('cog_overload'); // Q1
  const interleavingResponse = rawResponseMap.get('acq_interleaving'); // Q11
  const intentionResponse = rawResponseMap.get('env_implementation_intentions'); // Q12

  const contradictionsDetected: DiagnosticContradiction[] = [];
  const hiddenCrossPillarPatterns: DiagnosticReport['hiddenCrossPillarPatterns'] = [];

  // Rule 1 — Recognition-Reliant Learning Pattern / Fluency Illusion
  const isPassiveAcquisition = acqResponse === 'acq_1_a' || acqResponse === 'acq_1_c';
  const hasFluencyIllusion = fluencyResponse === 'reg_1_a';
  const missedMiniRecall = miniPerfResponse && miniPerfResponse !== 'perf_1_a';

  if (isPassiveAcquisition || hasFluencyIllusion || missedMiniRecall) {
    contradictionsDetected.push({
      title: 'Recognition Reliance (The Fluency Illusion)',
      description: 'Your study habits rely on re-reading or notes review until sentences look familiar. When you re-read, recognition feels effortless, which tricks your brain into thinking you have mastered the topic. On a blank exam page, however, memory retrieval collapses.',
      scientificInsight: 'Bjork, Dunlosky & Kornell (2013) demonstrated that passive re-reading inflates perceived competence while generating almost zero active retrieval strength.',
      citation: 'Bjork, Dunlosky & Kornell (2013); Roediger & Karpicke (2006)'
    });

    hiddenCrossPillarPatterns.push({
      name: 'Metacognition × Retrieval Mechanics Trap',
      pillarsInvolved: ['Knowledge Acquisition', 'Metacognition & Self-Regulation'],
      description: 'You stop reviewing when notes look recognizable rather than when you can reproduce them closed-book. This causes unexpected memory blanks under exam conditions.',
      fix: 'Use the 5-Minute Blank Page rule: close notes and write down key concepts from memory before opening any study materials.'
    });
  }

  // Rule 2 — Motivated but Under-Structured
  const isHighMotivation = effortResponse === 'mot_1_b';
  const isLowEnvConsistency = envResponse === 'env_1_a' || envResponse === 'env_1_c' || intentionResponse === 'env_2_b' || intentionResponse === 'env_2_c';

  if (isHighMotivation && isLowEnvConsistency) {
    contradictionsDetected.push({
      title: 'Intention-Action Disconnect (Motivated but Under-Structured)',
      description: 'You possess high personal motivation and resilience when learning, but your external study system relies heavily on willpower in high-friction environments (notifications, hostel noise, power unpredictability).',
      scientificInsight: 'Gollwitzer (1999) proved that general intentions fail under fatigue unless converted into concrete "When-Then" implementation cues.',
      citation: 'Gollwitzer (1999); Ophir, Nass & Wagner (2009)'
    });

    hiddenCrossPillarPatterns.push({
      name: 'Motivation × Environment Disconnect',
      pillarsInvolved: ['Motivation & Identity', 'Learning Environment & Behavioral System'],
      description: 'Your willpower is carrying the burden that a simple environment routine (offline downloads, phone in another room, 25-min timers) should automate.',
      fix: 'Anchor your study to a concrete daily trigger: "When 5:00 PM arrives, I turn on airplane mode and do 1 recall block."'
    });
  }

  // Rule 3 — Fact-Strong, Structure-Weak (Recall without Transfer)
  const isSurfaceTransfer = transferResponse === 'perf_2_a' || transferResponse === 'perf_2_c';
  const isBlockedPractice = interleavingResponse === 'acq_3_a';

  if (isSurfaceTransfer || isBlockedPractice) {
    hiddenCrossPillarPatterns.push({
      name: 'Knowledge Organization × Novel Transfer Gap',
      pillarsInvolved: ['Knowledge Organization', 'Performance Optimization'],
      description: 'You can solve questions that look like textbook examples, but struggle when WAEC, JAMB, or university professors disguise the concept in an unfamiliar word problem.',
      fix: 'Practice interleaved problem sets: mix 3 different question types together so your brain learns to identify which governing rule applies.'
    });
  }

  // Rule 4 — Cognitive Load Overload during Multi-step explanations
  const isCognitiveOverload = overloadResponse === 'cog_1_a' || overloadResponse === 'cog_1_c';
  if (isCognitiveOverload) {
    hiddenCrossPillarPatterns.push({
      name: 'Working Memory × Explanation Design Mismatch',
      pillarsInvolved: ['Cognitive Processing System', 'Knowledge Acquisition'],
      description: 'Trying to hold 4-5 intermediate steps in your head during technical proofs or scientific mechanisms causes attention crashes.',
      fix: 'Faded Worked Examples: sketch intermediate constraint diagrams on scrap paper rather than keeping them in mental RAM.'
    });
  }

  // Identify Bottlenecks & Strengths
  const sortedDims = [...updatedDimensions].sort((a, b) => a.score - b.score);
  const primary = sortedDims[0];
  const secondary = sortedDims[1];
  const highest = sortedDims[sortedDims.length - 1];

  // Learning Style Debunking (Pashler et al. 2008)
  let statedPref = 'Visual diagrams & animations';
  if (prefResponse === 'pref_1_b') statedPref = 'Step-by-step written text & notes';
  else if (prefResponse === 'pref_1_c') statedPref = 'Worked problems & hands-on exercises';
  else if (prefResponse === 'pref_1_d') statedPref = 'Audio explanations & group discussions';

  const learningStyleDebunkInsight = {
    statedPreference: statedPref,
    evidenceBasedStrategy: 'Closed-book retrieval practice, distributed spacing, and interleaved application.',
    pashlerScienceNote: 'Comprehensive systematic reviews (Pashler, McDaniel, Rohrer & Bjork, 2008) conclusively demonstrated that matching teaching exclusively to a student\'s claimed "modality" (visual, auditory) does not boost test results. While your preferred format helps you start comfortably, durable memory consolidation requires effortful active recall regardless of sensory preference.'
  };

  // Section K: Hard Cap of 2-3 Priority Interventions (Section L Library)
  const priorityInterventions: TargetedInterventionItem[] = [
    {
      rank: 1,
      pattern: primary.key === 'knowledge_acquisition' 
        ? 'Recognition reliance & passive re-reading' 
        : primary.key === 'self_regulation' 
        ? 'Fluency illusion & unclassified error patterns' 
        : `${primary.name} friction`,
      interventionName: primary.key === 'knowledge_acquisition'
        ? 'Closed-Book Free Recall Protocol'
        : primary.key === 'self_regulation'
        ? 'Confidence Pre-Rating & Error Taxonomy'
        : primary.key === 'environment_behavior'
        ? 'Distraction-Shielded Implementation Intentions'
        : 'Cognitive Chunking & Faded Worked Examples',
      targetPillar: primary.key,
      why: primary.key === 'knowledge_acquisition'
        ? 'Pulling information from memory directly strengthens synaptic pathways and memory traces, whereas re-reading creates an illusion of competence (Roediger & Karpicke, 2006; Dunlosky et al., 2013).'
        : primary.key === 'self_regulation'
        ? 'Forcing yourself to rate confidence before checking answers eliminates the fluency illusion and identifies real cognitive gaps (Bjork et al., 2013; Zimmerman, 2002).'
        : 'Designing concrete environmental triggers closes the intention-action gap without exhausting daily willpower (Gollwitzer, 1999).',
      forWhom: `Learners experiencing friction in ${primary.name} (score: ${primary.score}/100).`,
      when: 'First 5–10 minutes of every study session, before opening any textbook or summary notes.',
      how: primary.key === 'knowledge_acquisition'
        ? 'Close all notes. Take a clean sheet of paper. Write down everything you remember about the previous lecture. Only reopen notes to fill gaps in red ink.'
        : primary.key === 'self_regulation'
        ? 'Before looking at the answer key, write your 1-5 confidence level. When wrong, tag the mistake: Concept Gap, Misreading, or Careless Execution.'
        : 'Define your When-Then cue: "When I sit at my desk at 5 PM, phone goes on airplane mode across the room and a 25-minute timer starts."',
      measure: 'Delayed free-recall accuracy at 48 hours (>75%), not total hours spent reviewing.'
    },
    {
      rank: 2,
      pattern: secondary.key === 'environment_behavior'
        ? 'High intention with environmental distraction friction'
        : 'Surface problem mimicry without deep transfer',
      interventionName: secondary.key === 'environment_behavior'
        ? 'Friction-Free Study Block Safeguards'
        : 'Interleaved Practice & Far-Transfer Challenges',
      targetPillar: secondary.key,
      why: secondary.key === 'environment_behavior'
        ? 'Contextual shields prevent costly task-switching penalties and preserve working memory bandwidth (Ophir et al., 2009).'
        : 'Mixing problem types trains your brain to discriminate which governing rule applies under authentic exam pressure (Rohrer & Taylor, 2007).',
      forWhom: `Learners seeking to reinforce ${secondary.name} (${secondary.score}/100).`,
      when: 'During practice problem sessions and weekly review sprints.',
      how: secondary.key === 'environment_behavior'
        ? 'Pre-download lecture PDFs for offline access. Use a physical notebook to avoid screen notifications. Set fixed 25-min focus blocks.'
        : 'Never solve 10 identical problems in a row. Shuffle 3 different problem types so you have to diagnose the formula each time.',
      measure: 'Session completion rate relative to planned sessions (target: >85%).'
    }
  ];

  // Optional 3rd intervention if there is a distinct leverageable strength or transfer gap
  if (primary.key !== 'performance_optimization' && secondary.key !== 'performance_optimization') {
    priorityInterventions.push({
      rank: 3,
      pattern: 'Surface template mimicry',
      interventionName: 'Teach-Back & Analogy Stress-Test',
      targetPillar: 'performance_optimization',
      why: 'Explaining a principle to a novice forces you to identify missing logical steps and build deep structural schemas (Chi et al., 1981).',
      forWhom: 'Learners preparing for unfamiliar questions in WAEC, JAMB, or university degree exams.',
      when: 'At the end of learning any major theoretical concept.',
      how: 'Explain the concept in 3 plain sentences to a friend or into your phone voice recorder, using an everyday real-world analogy. If you use technical jargon without explaining it, restart.',
      measure: 'Ability to answer unexpected past-paper questions without consulting notes.'
    });
  }

  // Recommended AI Roles (Section M)
  const recommendedAIRoles = [
    {
      roleName: primary.key === 'knowledge_acquisition' ? 'Retrieval Coach' : 'Metacognitive Coach',
      tagline: primary.key === 'knowledge_acquisition' ? 'Closed-Book Memory Trainer' : 'Confidence & Error Calibrator',
      whyThisRole: primary.key === 'knowledge_acquisition'
        ? 'Generates active recall prompts matched to your exact edge of knowledge, keeping you out of the passive re-reading trap.'
        : 'Asks you to predict your performance before revealing answers, helping you eliminate overconfidence and classify mistakes.'
    },
    {
      roleName: 'Error Analyst',
      tagline: 'Root-Cause Mistake Taxonomy',
      whyThisRole: 'Inspects your missed questions and categorizes whether it was a conceptual gap, formula slip, or misread question.'
    },
    {
      roleName: 'Study Architect',
      tagline: 'Contextual Session Planner',
      whyThisRole: 'Builds realistic daily study sessions adapted to your phone battery, power supply, and syllabus milestones.'
    }
  ];

  // Calculate reassessment date (18 days out)
  const now = new Date();
  const reassessDate = new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000);
  const formattedReassess = reassessDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Executive summary
  const executiveSummary = `Your diagnostic profile demonstrates strong ${highest.name.toLowerCase()} (${highest.score}/100), which gives you an excellent cognitive anchor. However, your primary learning system bottleneck is in ${primary.name} (${primary.score}/100, ${primary.confidenceBand} evidence), compounded by ${secondary.name} (${secondary.score}/100). The diagnostic detected clear evidence of ${contradictionsDetected[0]?.title || 'recognition reliance'}: reviewing material until it feels familiar rather than testing closed-book retrieval. By focusing exclusively on the 2 targeted interventions below, you will convert passive study hours into durable, exam-ready recall.`;

  const report: DiagnosticReport = {
    generatedAt: now.toISOString(),
    reassessmentDate: formattedReassess,
    overallConfidence: 'High',
    executiveSummary,
    primaryBottleneck: {
      key: primary.key,
      name: primary.name,
      score: primary.score,
      confidenceBand: primary.confidenceBand || 'High',
      rationale: `Diagnostic evidence identifies this as your lowest-scoring subsystem (${primary.score}/100) with the highest multiplier on your overall study retention.`
    },
    secondaryBottleneck: {
      key: secondary.key,
      name: secondary.name,
      score: secondary.score,
      confidenceBand: secondary.confidenceBand || 'Moderate',
      rationale: `Secondary friction area (${secondary.score}/100) that interacts directly with your primary bottleneck.`
    },
    leverageableStrength: {
      key: highest.key,
      name: highest.name,
      score: highest.score,
      howToLeverage: `Your high baseline in ${highest.name} provides the psychological and cognitive stability needed to stick with effortful retrieval habits.`
    },
    contradictionsDetected,
    hiddenCrossPillarPatterns,
    learningStyleDebunkInsight,
    priorityInterventions,
    recommendedAIRoles
  };

  // Convert priority interventions into active app interventions
  const initialInterventions: Intervention[] = priorityInterventions.slice(0, 2).map((item, idx) => ({
    id: `int_plsfr_${Date.now()}_${idx}`,
    title: item.interventionName,
    targetDimension: item.targetPillar,
    problem: `PLSFR+ Engine identified ${item.pattern} as an active bottleneck.`,
    reason: item.why,
    action: item.how,
    frequency: item.when,
    expectedOutcome: item.measure,
    priority: idx === 0 ? 'High' : 'Medium',
    status: 'Active',
    evidenceOrigin: `PLSFR+ Triangulated Diagnostic (Priority ${item.rank})`
  }));

  return { updatedDimensions, report, initialInterventions };
}

/**
 * Fallback Default Report for Demo Account or Initial State
 */
export const DEFAULT_DEMO_REPORT: DiagnosticReport = {
  generatedAt: new Date().toISOString(),
  reassessmentDate: 'October 9, 2026',
  overallConfidence: 'High',
  executiveSummary: 'Your diagnostic profile shows strong motivation and cognitive processing capacity (79/100), providing an excellent foundation. However, your primary bottleneck sits in Self-Regulation & Metacognitive Calibration (44/100, High Evidence), coupled with Knowledge Acquisition (51/100). The diagnostic identified a clear Recognition Reliance pattern: you frequently re-read notes until sentences look familiar, creating an illusion of competence that breaks down when facing blank test papers.',
  primaryBottleneck: {
    key: 'self_regulation',
    name: 'Self-Regulation & Metacognition',
    score: 44,
    confidenceBand: 'High',
    rationale: 'High confidence during reading is not matching independent recall accuracy under test conditions.'
  },
  secondaryBottleneck: {
    key: 'knowledge_acquisition',
    name: 'Knowledge Acquisition & Learning Mechanics',
    score: 51,
    confidenceBand: 'High',
    rationale: 'Over-reliance on passive re-reading rather than spaced, closed-book retrieval.'
  },
  leverageableStrength: {
    key: 'motivation_emotion_identity',
    name: 'Motivation, Emotion & Learning Identity',
    score: 79,
    howToLeverage: 'Your resilient attitude toward productive struggle is the exact engine needed to persist through the discomfort of active recall.'
  },
  contradictionsDetected: [
    {
      title: 'Recognition Reliance (The Fluency Illusion)',
      description: 'You reported high confidence when re-reading study notes, but your scenario response revealed vulnerability when forced to retrieve formulas without hints.',
      scientificInsight: 'Bjork, Dunlosky & Kornell (2013) proved that reading fluency creates a false sense of mastery because answers are already visible in front of you.',
      citation: 'Bjork, Dunlosky & Kornell (2013); Dunlosky et al. (2013)'
    },
    {
      title: 'Intention vs. Environment Disconnect',
      description: 'You have high personal motivation, but study in high-distraction environments without implementation triggers, forcing your willpower to do all the work.',
      scientificInsight: 'Gollwitzer (1999) demonstrated that without concrete "When-Then" cues, cognitive fatigue derails even highly motivated students.',
      citation: 'Gollwitzer (1999)'
    }
  ],
  hiddenCrossPillarPatterns: [
    {
      name: 'Metacognition × Retrieval Mechanics Trap',
      pillarsInvolved: ['Knowledge Acquisition', 'Self-Regulation & Metacognition'],
      description: 'Mistaking familiarity for recall leads you to stop studying too early, before memories are consolidated.',
      fix: 'Always test yourself on a blank sheet of paper before opening your notes.'
    },
    {
      name: 'Motivation × Environment Disconnect',
      pillarsInvolved: ['Motivation', 'Environment & Behavioral System'],
      description: 'Relying on willpower in a hostel room with notifications leads to frequent study stalls despite high ambition.',
      fix: 'Put your phone in another room and use 25-minute offline focus blocks.'
    }
  ],
  learningStyleDebunkInsight: {
    statedPreference: 'Visual diagrams, animations & worked problems',
    evidenceBasedStrategy: 'Closed-book retrieval practice and distributed spacing.',
    pashlerScienceNote: 'Pashler, McDaniel, Rohrer & Bjork (2008) conclusively proved that classifying students by learning styles (visual, auditory) does not improve exam outcomes. While visual diagrams provide an enjoyable starting point, durable retention requires retrieving concepts from memory.'
  },
  priorityInterventions: [
    {
      rank: 1,
      pattern: 'Recognition reliance & fluency illusion',
      interventionName: 'Closed-Book Free Recall Protocol',
      targetPillar: 'knowledge_acquisition',
      why: 'Retrieval practice actively strengthens synaptic memory traces far more than re-reading (Roediger & Karpicke, 2006; Dunlosky et al., 2013).',
      forWhom: 'Students who understand concepts during lectures, but blank out when the exam paper is distributed.',
      when: 'First 5–10 minutes of every study session, before opening any notes.',
      how: 'Close all books. Take a blank page. Write down or sketch everything you remember from the last session. Reopen notes only to fill gaps in colored ink.',
      measure: 'Delayed free-recall accuracy at 48 hours without notes (>75%).'
    },
    {
      rank: 2,
      pattern: 'Fluency illusion & unclassified error patterns',
      interventionName: 'Confidence Pre-Rating & Error Taxonomy',
      targetPillar: 'self_regulation',
      why: 'Rating your confidence before checking answers eliminates the illusion of competence and pinpoints exact cognitive failure points (Bjork et al., 2013).',
      forWhom: 'Students surprised by unexpected mistakes on test day.',
      when: 'Every time you solve practice problems or past exam questions.',
      how: 'Rate confidence (1 to 5) before checking the mark scheme. When wrong, classify the mistake: Concept Gap, Misread Question, or Careless Slip.',
      measure: 'Overconfidence gap reduced to zero within 2 weeks.'
    },
    {
      rank: 3,
      pattern: 'Willpower exhaustion from notification interruptions',
      interventionName: 'Distraction-Shielded Implementation Intentions',
      targetPillar: 'environment_behavior',
      why: 'Pre-deciding environmental cues automates study initiation and eliminates decision fatigue (Gollwitzer, 1999).',
      forWhom: 'Students in busy hostels, shared rooms, or with frequent phone interruptions.',
      when: 'Every evening during study planning.',
      how: 'Set a clear rule: "When it is 5:00 PM, my phone goes on airplane mode in my bag and I start a 25-minute recall block."',
      measure: 'Session start rate relative to planned sessions (>85%).'
    }
  ],
  recommendedAIRoles: [
    {
      roleName: 'Retrieval Coach',
      tagline: 'Active Recall Drill Partner',
      whyThisRole: 'Generates low-stakes recall questions that force your brain to retrieve knowledge without notes.'
    },
    {
      roleName: 'Metacognitive Coach',
      tagline: 'Confidence Calibration Guide',
      whyThisRole: 'Prompts you to assess your certainty before answering to cure the fluency illusion.'
    },
    {
      roleName: 'Error Analyst',
      tagline: 'Root-Cause Mistake Inspector',
      whyThisRole: 'Diagnoses missed test questions and breaks down why the mistake happened.'
    }
  ]
};
