
import React from 'react';
import { ShieldAlert, Activity, Database, GitBranch } from 'lucide-react';

export const COLORS = {
  illicit: '#ef4444', // Red
  mule: '#f59e0b',    // Orange
  clean: '#22d3ee',   // Cyan
  bg: '#020617',
  card: '#0f172a',
  accent: '#6366f1'   // Indigo
};

export const RAW_WALLET_DATA = [
  { wallet_id: "WALLET_0", mean_score: 2.85, max_score: 5.4, illicit_ratio: 0.5, wallet_score: 9.25 },
  { wallet_id: "WALLET_1", mean_score: 2.13, max_score: 5.7, illicit_ratio: 0.33, wallet_score: 8.5 },
  { wallet_id: "WALLET_10", mean_score: 3.8, max_score: 5.7, illicit_ratio: 0.67, wallet_score: 10.84 },
  { wallet_id: "WALLET_11", mean_score: 2.85, max_score: 5.3, illicit_ratio: 0.5, wallet_score: 9.15 },
  { wallet_id: "WALLET_12", mean_score: 2.85, max_score: 5.3, illicit_ratio: 0.5, wallet_score: 9.15 },
  { wallet_id: "WALLET_13", mean_score: 2.85, max_score: 5.3, illicit_ratio: 0.5, wallet_score: 9.15 },
  { wallet_id: "WALLET_14", mean_score: 2.13, max_score: 5.7, illicit_ratio: 0.33, wallet_score: 8.5 },
  { wallet_id: "WALLET_15", mean_score: 5.47, max_score: 5.7, illicit_ratio: 1.0, wallet_score: 13.17 },
  { wallet_id: "WALLET_16", mean_score: 3.8, max_score: 5.8, illicit_ratio: 0.67, wallet_score: 10.93 },
  { wallet_id: "WALLET_17", mean_score: 5.47, max_score: 5.7, illicit_ratio: 1.0, wallet_score: 13.17 },
  { wallet_id: "WALLET_18", mean_score: 5.47, max_score: 5.7, illicit_ratio: 1.0, wallet_score: 13.17 },
  { wallet_id: "WALLET_19", mean_score: 5.47, max_score: 5.7, illicit_ratio: 1.0, wallet_score: 13.17 },
  { wallet_id: "WALLET_2", mean_score: 2.13, max_score: 5.7, illicit_ratio: 0.33, wallet_score: 8.5 },
  { wallet_id: "WALLET_20", mean_score: 4.28, max_score: 6.1, illicit_ratio: 0.75, wallet_score: 11.88 },
  { wallet_id: "WALLET_21", mean_score: 2.85, max_score: 5.3, illicit_ratio: 0.5, wallet_score: 9.15 },
  { wallet_id: "WALLET_22", mean_score: 2.85, max_score: 5.4, illicit_ratio: 0.5, wallet_score: 9.25 },
  { wallet_id: "WALLET_23", mean_score: 3.03, max_score: 6.1, illicit_ratio: 0.5, wallet_score: 10.13 },
  { wallet_id: "WALLET_24", mean_score: 2.85, max_score: 5.4, illicit_ratio: 0.5, wallet_score: 9.25 },
  { wallet_id: "WALLET_3", mean_score: 2.85, max_score: 5.3, illicit_ratio: 0.5, wallet_score: 9.15 },
  { wallet_id: "WALLET_4", mean_score: 2.13, max_score: 5.7, illicit_ratio: 0.33, wallet_score: 8.5 },
  { wallet_id: "WALLET_5", mean_score: 2.13, max_score: 5.7, illicit_ratio: 0.33, wallet_score: 8.5 },
  { wallet_id: "WALLET_6", mean_score: 2.85, max_score: 5.4, illicit_ratio: 0.5, wallet_score: 9.25 },
  { wallet_id: "WALLET_7", mean_score: 2.13, max_score: 5.7, illicit_ratio: 0.33, wallet_score: 8.5 },
  { wallet_id: "WALLET_8", mean_score: 5.56, max_score: 6.31, illicit_ratio: 1.0, wallet_score: 13.87 },
  { wallet_id: "WALLET_9", mean_score: 2.85, max_score: 5.4, illicit_ratio: 0.5, wallet_score: 9.25 }
];

export const NAV_ITEMS = [
  { id: 'dashboard', icon: <Activity size={20} />, label: 'Monitor' },
  { id: 'explorer', icon: <GitBranch size={20} />, label: 'Graph Explorer' },
  { id: 'database', icon: <Database size={20} />, label: 'Ledger' }
];
