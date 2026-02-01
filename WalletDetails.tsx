
import React from 'react';
import { WalletNode } from '../types';
import { ShieldAlert, TrendingUp, ExternalLink, Zap, BarChart3, Target, Percent } from 'lucide-react';

interface WalletDetailsProps {
  wallet: WalletNode | null;
  onClose: () => void;
}

const WalletDetails: React.FC<WalletDetailsProps> = ({ wallet, onClose }) => {
  if (!wallet) return null;

  return (
    <div className="glass h-full p-6 border-l border-white/10 flex flex-col gap-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap size={20} className="text-indigo-400" />
            Wallet Intelligence
          </h2>
          <p className="text-slate-400 mono text-sm">{wallet.id}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
      </div>

      {/* Main Wallet Score Card */}
      <div className={`p-5 rounded-2xl border ${wallet.suspicionScore > 70 ? 'border-red-500/50 bg-red-500/10' : wallet.suspicionScore > 30 ? 'border-amber-500/50 bg-amber-500/10' : 'border-cyan-500/50 bg-cyan-500/10'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-300">Composite Score</span>
          <span className={`text-3xl font-black ${wallet.suspicionScore > 70 ? 'text-red-500' : wallet.suspicionScore > 30 ? 'text-amber-500' : 'text-cyan-400'}`}>
            {wallet.wallet_score.toFixed(2)}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div 
            className={`h-full transition-all duration-1000 ${wallet.suspicionScore > 70 ? 'bg-red-500 glow-red' : wallet.suspicionScore > 30 ? 'bg-amber-500 shadow-amber-500 shadow-sm' : 'bg-cyan-400 glow-cyan'}`} 
            style={{ width: `${wallet.suspicionScore}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase text-right">
            Risk level: {wallet.suspicionScore > 70 ? 'High' : wallet.suspicionScore > 30 ? 'Medium' : 'Low'}
        </div>
      </div>

      {/* Specific Metrics Grid */}
      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <BarChart3 size={14} /> Metric Breakdown
        </h3>
        <div className="grid grid-cols-1 gap-3">
            <div className="glass p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Percent size={14} className="text-indigo-400" />
                    <span className="text-xs font-medium text-slate-300">Illicit Ratio</span>
                </div>
                <span className="font-mono font-bold">{(wallet.illicit_ratio * 100).toFixed(1)}%</span>
            </div>
            <div className="glass p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Target size={14} className="text-indigo-400" />
                    <span className="text-xs font-medium text-slate-300">Max Score</span>
                </div>
                <span className="font-mono font-bold">{wallet.max_score.toFixed(2)}</span>
            </div>
            <div className="glass p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-indigo-400" />
                    <span className="text-xs font-medium text-slate-300">Mean Score</span>
                </div>
                <span className="font-mono font-bold">{wallet.mean_score.toFixed(2)}</span>
            </div>
        </div>
      </div>

      {/* Behavioral Tags */}
      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <ShieldAlert size={14} /> Heuristic Analysis
        </h3>
        <div className="flex flex-wrap gap-2">
          {wallet.tags.length > 0 ? wallet.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-[10px] rounded border border-indigo-500/20 font-bold uppercase">
              {tag}
            </span>
          )) : (
            <span className="text-slate-500 text-xs italic">Normal profile.</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
        <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-600/20 active:scale-95">
           Investigate Node
        </button>
        <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm border border-white/10 active:scale-95">
          <ExternalLink size={16} /> Block Explorer
        </button>
      </div>
    </div>
  );
};

export default WalletDetails;
