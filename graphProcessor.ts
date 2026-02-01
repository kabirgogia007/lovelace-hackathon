
import { GraphData, WalletNode, GraphEdge } from '../types';
import { RAW_WALLET_DATA } from '../constants';

/**
 * Normalizes the wallet_score (roughly 8-14) to a 0-100 scale for UI progress bars.
 */
const normalizeScore = (score: number) => {
    const min = 8.0;
    const max = 14.0;
    const normalized = ((score - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, Math.round(normalized)));
};

export const generateGraphFromScores = (): GraphData => {
  const nodes: WalletNode[] = RAW_WALLET_DATA.map(item => {
    const normalized = normalizeScore(item.wallet_score);
    let type: 'illicit' | 'mule' | 'clean' = 'clean';
    let tags: string[] = [];

    if (item.wallet_score >= 12.0) {
      type = 'illicit';
      tags = ['High Illicit Ratio', 'Pattern Source/Sink'];
    } else if (item.wallet_score >= 10.0) {
      type = 'mule';
      tags = ['Suspected Mule', 'Layering Activity'];
    } else {
      type = 'clean';
      tags = ['Low Risk Profile'];
    }

    if (item.illicit_ratio === 1.0) tags.push('100% Illicit Connection');

    return {
      id: item.wallet_id,
      label: item.wallet_id,
      suspicionScore: normalized,
      type,
      wallet_score: item.wallet_score,
      mean_score: item.mean_score,
      max_score: item.max_score,
      illicit_ratio: item.illicit_ratio,
      totalIn: Math.random() * 500,
      totalOut: Math.random() * 480,
      tags
    };
  });

  const links: GraphEdge[] = [];
  
  // Arrange nodes into a "Fan-out / Fan-in" Smurfing pattern
  const highRisk = nodes.filter(n => n.type === 'illicit');
  const mediumRisk = nodes.filter(n => n.type === 'mule');
  const lowRisk = nodes.filter(n => n.type === 'clean');

  // We assume the highest scoring node is the source
  const source = highRisk.sort((a,b) => b.wallet_score - a.wallet_score)[0];
  const sink = highRisk.sort((a,b) => b.wallet_score - a.wallet_score)[1];

  // Source -> Mules (Fan-out)
  mediumRisk.forEach(mule => {
    links.push({
      source: source.id,
      target: mule.id,
      amount: 50 + Math.random() * 10,
      timestamp: new Date().toISOString()
    });
  });

  // Mules -> Low Risk (Layering)
  lowRisk.forEach((node, idx) => {
    const parentMule = mediumRisk[idx % mediumRisk.length];
    links.push({
      source: parentMule.id,
      target: node.id,
      amount: 10 + Math.random() * 5,
      timestamp: new Date().toISOString()
    });
    
    // Low Risk -> Sink (Fan-in)
    links.push({
      source: node.id,
      target: sink.id,
      amount: 8 + Math.random() * 4,
      timestamp: new Date().toISOString()
    });
  });

  return { nodes, links };
};
