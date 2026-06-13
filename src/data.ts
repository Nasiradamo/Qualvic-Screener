import { ScreenerData, SimPersona, Question } from './types';

export const INITIAL_SCREENER: ScreenerData = {
  id: 'screener_q2_ux',
  name: 'UX/UI Product Design Survey Screener',
  status: 'draft',
  fraudSensitivity: 'medium',
  questions: [
    {
      id: 'Q1',
      type: 'single_choice',
      text: 'What is your primary design tool of choice?',
      fraudWeight: 30,
      isTwinVerify: false,
      options: [
        { id: 'q1_o1', text: 'Figma', status: 'qualify' },
        { id: 'q1_o2', text: 'Adobe XD / Sketch', status: 'qualify' },
        { id: 'q1_o3', text: 'MS Paint / Excel Tables', status: 'disqualify' },
        { id: 'q1_o4', text: 'Pen & Paper strictly', status: 'neutral' },
      ],
    },
    {
      id: 'Q2',
      type: 'single_choice',
      text: 'How many years of professional experience do you have in UX/UI design?',
      fraudWeight: 45,
      isTwinVerify: true,
      twinOfId: 'Q5_VERIFY',
      options: [
        { id: 'q2_o1', text: 'None / Student', status: 'disqualify' },
        { id: 'q2_o2', text: '1 - 3 Years', status: 'qualify' },
        { id: 'q2_o3', text: '4+ Years', status: 'qualify' },
      ],
    },
    {
      id: 'Q3',
      type: 'single_choice',
      text: 'Have you ever built or configured adaptive logic in screeners?',
      fraudWeight: 15,
      isTwinVerify: false,
      options: [
        { id: 'q3_o1', text: 'Yes, extensively', status: 'qualify' },
        { id: 'q3_o2', text: 'Yes, but very basic', status: 'qualify' },
        { id: 'q3_o3', text: 'No, never', status: 'neutral' },
      ],
    },
    {
      id: 'Q4',
      type: 'single_choice',
      text: 'What is your primary region of design residency?',
      fraudWeight: 20,
      isTwinVerify: false,
      options: [
        { id: 'q4_o1', text: 'North America', status: 'qualify' },
        { id: 'q4_o2', text: 'Europe & UK', status: 'qualify' },
        { id: 'q4_o3', text: 'Asia-Pacific', status: 'qualify' },
        { id: 'q4_o4', text: 'Other Region', status: 'neutral' },
      ],
    },
  ],
  rules: [
    {
      id: 'rule_1',
      questionId: 'Q1',
      answerOptionId: 'q1_o1',
      action: 'continue',
      targetQuestionId: 'Q2',
    },
    {
      id: 'rule_2',
      questionId: 'Q1',
      answerOptionId: 'q1_o2',
      action: 'continue',
      targetQuestionId: 'Q2',
    },
    {
      id: 'rule_3',
      questionId: 'Q1',
      answerOptionId: 'q1_o3',
      action: 'disqualify',
    },
    {
      id: 'rule_4',
      questionId: 'Q1',
      answerOptionId: 'q1_o4',
      action: 'continue',
      targetQuestionId: 'Q3',
    },
    {
      id: 'rule_5',
      questionId: 'Q2',
      answerOptionId: 'q2_o1',
      action: 'disqualify',
    },
    {
      id: 'rule_6',
      questionId: 'Q2',
      answerOptionId: 'q2_o2',
      action: 'continue',
      targetQuestionId: 'Q3',
    },
    {
      id: 'rule_7',
      questionId: 'Q2',
      answerOptionId: 'q2_o3',
      action: 'continue',
      targetQuestionId: 'Q4',
    },
    {
      id: 'rule_8',
      questionId: 'Q3',
      answerOptionId: 'q3_o1',
      action: 'qualify',
    },
    {
      id: 'rule_9',
      questionId: 'Q3',
      answerOptionId: 'q3_o2',
      action: 'qualify',
    },
    // Note: Option q3_o3 'No, never' and Q4 'Other Region' purposefully trigger diagnostic warning checks later
    {
      id: 'rule_10',
      questionId: 'Q4',
      answerOptionId: 'q4_o1',
      action: 'qualify',
    },
    {
      id: 'rule_11',
      questionId: 'Q4',
      answerOptionId: 'q4_o2',
      action: 'qualify',
    },
    {
      id: 'rule_12',
      questionId: 'Q4',
      answerOptionId: 'q4_o3',
      action: 'qualify',
    },
  ],
  validationBranch: {
    smartTriggers: {
      vpnDetected: true,
      rapidResponse: false,
      ipMismatch: true,
    },
    riskThreshold: 70,
    verificationQuestions: [
      {
        id: 'VQ1',
        type: 'single_choice',
        text: 'Anti-Bot verification: Select the term that represents the "U" in UX.',
        fraudWeight: 80,
        isTwinVerify: false,
        isVerificationQuestion: true,
        shieldIcon: true,
        options: [
          { id: 'vq1_o1', text: 'Utility', status: 'disqualify' },
          { id: 'vq1_o2', text: 'User', status: 'qualify' },
          { id: 'vq1_o3', text: 'Universal', status: 'disqualify' },
        ],
      },
      {
        id: 'VQ2',
        type: 'single_choice',
        text: 'Verify your core design principle knowledge: Which format is natively browser-scalable?',
        fraudWeight: 90,
        isTwinVerify: false,
        isVerificationQuestion: true,
        shieldIcon: true,
        options: [
          { id: 'vq2_o1', text: 'PNG Bitmaps', status: 'disqualify' },
          { id: 'vq2_o2', text: 'SVG Vector markup', status: 'qualify' },
          { id: 'vq2_o3', text: 'GIF Layers', status: 'disqualify' },
        ],
      }
    ],
  },
};

export const LIST_OF_PERSONAS: SimPersona[] = [
  {
    id: 'per_1',
    name: 'Sarah Chen',
    role: 'Staff Product Designer',
    description: 'Legitimate participant. Extremely talented, Figma user, 5+ years experience, based in Seattle. Direct match.',
    tags: ['Verified ID', 'Excellent Fit', 'US resident'],
    avatar: '👩‍💻',
    answers: {
      'Q1': 'q1_o1', // Figma
      'Q2': 'q2_o3', // 4+ Years
      'Q4': 'q4_o1', // North America
      'VQ1': 'vq1_o2', // User
      'VQ2': 'vq2_o2', // SVG
    },
    vpn: false,
    rapid: false,
    ipMismatch: false,
    expectedOutcome: 'qualified',
    detectDetails: {
      claimed: 'Seattle, USA',
      detected: 'Seattle, USA',
      speed: 'Moderate (24s / page)',
    },
  },
  {
    id: 'per_2',
    name: 'Ben Reynolds',
    role: 'Hobbyist Designer',
    description: 'Casual explorer. Primarily uses MS Paint for custom retro hobby graphics. Experience level is low or none.',
    tags: ['Low Tenure', 'Screener Dropoff'],
    avatar: '🎨',
    answers: {
      'Q1': 'q1_o3', // MS Paint -> Disqualified directly!
    },
    vpn: false,
    rapid: false,
    ipMismatch: false,
    expectedOutcome: 'disqualified',
    detectDetails: {
      claimed: 'Bristol, UK',
      detected: 'Bristol, UK',
      speed: 'Slow (45s / page)',
    },
  },
  {
    id: 'per_3',
    name: 'Adio - Proxy Actor',
    role: 'Automated Bot Network',
    description: 'Suspected server proxy. Claims to be residing in New York, but VPN IP traces back to Frankfurt with 20ms response intervals.',
    tags: ['VPN Detected', 'IP Mismatch', 'High Fraud Risk'],
    avatar: '🤖',
    answers: {
      'Q1': 'q1_o1', // Figma
      'Q2': 'q2_o3', // 4+ Years
      'Q4': 'q4_o1', // North America
      'VQ1': 'vq1_o1', // Utility (Failed validation!)
      'VQ2': 'vq2_o1', // PNG Bitmaps (Failed validation!)
    },
    vpn: true,
    rapid: true,
    ipMismatch: true,
    expectedOutcome: 'validation_branch',
    detectDetails: {
      claimed: 'New York, USA',
      detected: 'Frankfurt, DE (Hosted VPN)',
      speed: 'Suspicous (<1.2s response)',
    },
  },
  {
    id: 'per_4',
    name: 'Lucas "Speedy" Miller',
    role: 'Commercial Form Filler',
    description: 'Rapidly clicks headers and ticks options without reading the text trying to cheat incentives. Triggers the Rapid Response flag.',
    tags: ['Rapid Clicker', 'Velocity Alert'],
    avatar: '⚡',
    answers: {
      'Q1': 'q1_o2', // Adobe XD
      'Q2': 'q2_o2', // 1-3 Years
      'Q3': 'q3_o1', // Yes, extensively
      'VQ1': 'vq1_o3', // Universal (Failed validation)
    },
    vpn: false,
    rapid: true,
    ipMismatch: false,
    expectedOutcome: 'flagged',
    detectDetails: {
      claimed: 'San Jose, USA',
      detected: 'San Jose, USA',
      speed: 'Rapid (Avg 0.4s / options)',
    },
  }
];
