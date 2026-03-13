export interface IndustrialPromotionAnalysis {
  fitScore: number;
  fitReasoning: string;
  relocationSignal: {
    intensity: 'high' | 'medium' | 'low';
    evidence: string[];
    recommendation: string;
  };
  policyMatching: {
    qualifications: string[];
    matchedPolicies: {
      name: string;
      benefit: string;
    }[];
    negotiationChips: string[];
  };
  roiPrediction: {
    taxRevenue: { year: string; amount: number }[];
    employment: number;
    industrialOutput: string;
  };
}

export interface InvestmentAnalysis {
  companyName: string;
  onePageTeaser: string;
  founderBackground: {
    name: string;
    education: string;
    experience: string;
    keyStrength: string;
  }[];
  marketAnalysis: {
    size: string;
    growth: string;
    competitors: {
      name: string;
      advantage: string;
      disadvantage: string;
    }[];
  };
  financials: {
    revenue: { year: string; amount: number }[];
    burnRate: string;
    valuationExpectation: string;
  };
  risks: string[];
  highlights: string[];
  industrialPromotion?: IndustrialPromotionAnalysis;
}

export interface MeetingMinutes {
  title: string;
  date: string;
  participants: string[];
  summary: string;
  keyDecisions: string[];
  actionItems: {
    task: string;
    owner: string;
    deadline: string;
  }[];
  transcript: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  content: string; // Base64 or text
  status: 'pending' | 'processing' | 'completed' | 'error';
  analysis?: InvestmentAnalysis;
  meetingMinutes?: MeetingMinutes;
}
