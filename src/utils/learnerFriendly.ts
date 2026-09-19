import { PlsfrDimensionKey } from '../types';

export interface FriendlyDimensionInfo {
  key: PlsfrDimensionKey;
  name: string;
  shortName: string;
  simpleDescription: string;
  whyItMatters: string;
  actionableTip: string;
  iconName: string;
}

export const FRIENDLY_DIMENSIONS: Record<PlsfrDimensionKey, FriendlyDimensionInfo> = {
  cognitive_processing: {
    key: 'cognitive_processing',
    name: 'Understanding',
    shortName: 'Understand',
    simpleDescription: 'How well you understand and break down ideas.',
    whyItMatters: 'Deep understanding lets you explain concepts in your own words instead of just memorising definitions.',
    actionableTip: 'Try explaining this concept to a friend or sketching a quick visual diagram without checking notes.',
    iconName: 'Brain'
  },
  knowledge_acquisition: {
    key: 'knowledge_acquisition',
    name: 'Learning new things',
    shortName: 'Learn',
    simpleDescription: 'How you remember information without looking at notes.',
    whyItMatters: 'Practicing recall without looking at your notes builds strong, long-lasting memory.',
    actionableTip: 'Close your book before answering, and space your reviews over 2 to 3 days.',
    iconName: 'BookOpen'
  },
  knowledge_organization: {
    key: 'knowledge_organization',
    name: 'Connecting ideas',
    shortName: 'Connect',
    simpleDescription: 'How you link ideas together into clear mental maps.',
    whyItMatters: 'Connected ideas make it easy to remember how different topics fit together.',
    actionableTip: 'Ask yourself: "How does this new idea connect to what I already learned?"',
    iconName: 'Network'
  },
  self_regulation: {
    key: 'self_regulation',
    name: 'Managing your learning',
    shortName: 'Manage',
    simpleDescription: 'How you plan, check your understanding, and catch mistakes.',
    whyItMatters: 'Knowing what you truly understand vs. what only feels familiar protects you on test day.',
    actionableTip: 'Rate your confidence honestly before checking answers to train your intuition.',
    iconName: 'Compass'
  },
  motivation_emotion_identity: {
    key: 'motivation_emotion_identity',
    name: 'How you feel about learning',
    shortName: 'Feel',
    simpleDescription: 'Your mindset, confidence, and how you handle tough challenges.',
    whyItMatters: 'Treating struggle as normal learning keeps you calm when questions get difficult.',
    actionableTip: 'Remember that mistakes are normal signals showing where your brain is growing.',
    iconName: 'Heart'
  },
  environment_behavior: {
    key: 'environment_behavior',
    name: 'Your study environment',
    shortName: 'Study',
    simpleDescription: 'Your study space, habits, focus, and routines.',
    whyItMatters: 'A calm study space saves mental energy so you can focus on what actually matters.',
    actionableTip: 'Turn off notifications or put your phone in another room during study sessions.',
    iconName: 'Coffee'
  },
  performance_optimization: {
    key: 'performance_optimization',
    name: 'Using what you know',
    shortName: 'Apply',
    simpleDescription: 'How you apply what you have learned to new and tricky problems.',
    whyItMatters: 'Real tests check whether you can use ideas when problems look unfamiliar.',
    actionableTip: 'Practice questions that change the scenario or wording from standard examples.',
    iconName: 'Zap'
  },
};

export function getFriendlyDimension(key: PlsfrDimensionKey): FriendlyDimensionInfo {
  return FRIENDLY_DIMENSIONS[key] || {
    key,
    name: key.replace(/_/g, ' '),
    shortName: key.slice(0, 7),
    simpleDescription: 'How you learn and perform.',
    whyItMatters: 'Understanding this helps you improve how you study.',
    actionableTip: 'Practice regularly with feedback.',
    iconName: 'Check'
  };
}

export function simplifyTechnicalTerm(term: string): string {
  const lower = term.toLowerCase();
  if (lower.includes('retrieval')) return 'Remembering without notes';
  if (lower.includes('application transfer') || lower.includes('transfer disparity')) return 'Using what you know';
  if (lower.includes('fluency illusion') || lower.includes('overconfidence') || lower.includes('calibration')) return 'Checking what you truly know';
  if (lower.includes('cognitive processing') || lower.includes('working memory')) return 'Understanding complex ideas';
  if (lower.includes('knowledge acquisition')) return 'Learning new things';
  if (lower.includes('knowledge organization')) return 'Connecting ideas';
  if (lower.includes('self-regulation')) return 'Managing your learning';
  if (lower.includes('environment')) return 'Your study environment';
  if (lower.includes('motivation')) return 'How you feel about learning';
  return term;
}
