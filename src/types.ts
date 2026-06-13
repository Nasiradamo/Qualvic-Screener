export type QuestionType = 'single_choice' | 'multi_choice' | 'text' | 'number';

export interface AnswerOption {
  id: string;
  text: string;
  status: 'qualify' | 'disqualify' | 'neutral';
  weight?: number; // Logic weight or custom indicator
}

export interface Question {
  id: string; // Q1, Q2, etc.
  type: QuestionType;
  text: string;
  options: AnswerOption[];
  fraudWeight: number; // 0 to 100
  isTwinVerify: boolean; // Verification twin option toggled
  twinOfId?: string;
  isVerificationQuestion?: boolean; // For validation branch
  shieldIcon?: boolean;
}

export type RuleAction = 'continue' | 'disqualify' | 'qualify' | 'validation_branch';

export interface RoutingRule {
  id: string;
  questionId: string; // "Q1"
  answerOptionId: string; // Option ID that triggers it
  action: RuleAction;
  targetQuestionId?: string; // Next question ID e.g., "Q2" or "Q3"
}

export interface SmartTriggers {
  vpnDetected: boolean;
  rapidResponse: boolean; // <2s response
  ipMismatch: boolean;
}

export interface ValidationBranch {
  smartTriggers: SmartTriggers;
  riskThreshold: number; // slider 0-100 threshold
  verificationQuestions: Question[];
}

export interface ScreenerData {
  id: string;
  name: string;
  status: 'draft' | 'live' | 'paused';
  fraudSensitivity: 'low' | 'medium' | 'high';
  questions: Question[];
  rules: RoutingRule[];
  validationBranch: ValidationBranch;
}

export interface SimPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  avatar: string;
  answers: Record<string, string>; // Maps Question ID -> Option ID
  vpn: boolean;
  rapid: boolean;
  ipMismatch: boolean;
  expectedOutcome: 'qualified' | 'disqualified' | 'validation_branch' | 'flagged';
  detectDetails: {
    claimed: string;
    detected: string;
    speed?: string;
  };
}

export interface WebhookConfig {
  url: string;
  event: string;
}
