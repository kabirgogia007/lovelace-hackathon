
export interface Transaction {
  Source_Wallet_ID: string;
  Dest_Wallet_ID: string;
  Timestamp: string;
  Amount: number;
  Token_Type: string;
}

export interface WalletNode {
  id: string;
  label: string;
  suspicionScore: number; // 0-100
  type: 'illicit' | 'mule' | 'clean';
  // Specific metrics from CSV
  wallet_score: number;
  mean_score: number;
  max_score: number;
  illicit_ratio: number;
  totalIn: number;
  totalOut: number;
  tags: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  amount: number;
  timestamp: string;
}

export interface GraphData {
  nodes: WalletNode[];
  links: GraphEdge[];
}

export interface AnalysisResult {
  summary: string;
  topologyDetected: string[];
  riskAssessment: 'Low' | 'Medium' | 'High' | 'Critical';
  reasoning: string;
}
