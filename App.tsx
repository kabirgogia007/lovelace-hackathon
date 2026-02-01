
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Upload, 
  AlertTriangle, 
  RefreshCw, 
  BrainCircuit,
  Filter,
  Download,
  Calculator,
  ChevronRight,
  Database,
  GitBranch,
  Activity,
  History,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { GraphData, WalletNode, AnalysisResult } from './types';
import { NAV_ITEMS, RAW_WALLET_DATA } from './constants';
import { generateGraphFromScores } from './services/graphProcessor';
import { analyzeGraphTopology } from './services/geminiService';
import GraphCanvas from './components/GraphCanvas';
import WalletDetails from './components/WalletDetails';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [graphData, setGraphData] = useState<GraphData>(generateGraphFromScores());
  const [selectedWallet, setSelectedWallet] = useState<WalletNode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Enhanced Wallet Lookup logic
  const foundWallet = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toUpperCase().trim();
    // Look up in our "Excel Sheet" (RAW_WALLET_DATA)
    const match = RAW_WALLET_DATA.find(w => w.wallet_id === query);
    if (match) {
        // Find the node in the current graph instance to highlight it
        return graphData.nodes.find(n => n.id === match.wallet_id) || null;
    }
    return null;
  }, [searchQuery, graphData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (foundWallet) {
      setSelectedWallet(foundWallet);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeGraphTopology(graphData);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleRefresh = () => {
    setGraphData(generateGraphFromScores());
    setAnalysis(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 selection:bg-indigo-500/30 font-['Space_Grotesk']">
      {/* Navigation Sidebar */}
      <nav className="w-20 lg:w-64 border-r border-white/5 bg-slate-900/40 backdrop-blur-xl flex flex-col p-4 z-20">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <AlertTriangle className="text-white" size={24} />
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tighter italic uppercase">Smurf<span className="text-indigo-500">Hunter</span></span>
        </div>

        <div className="flex-1 space-y-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 shadow-[0_0_20px_rgba(79,70,229,0.15)]' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <span className={activeTab === item.id ? 'text-indigo-400' : 'text-slate-500'}>{item.icon}</span>
              <span className="hidden lg:block font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 glass rounded-3xl border border-white/5 text-center">
            <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">Network Feed</div>
            <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                <span className="text-[10px] font-mono font-bold tracking-tight opacity-70 italic">SYNCED TO SHEET</span>
            </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Universal Search Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
          <form onSubmit={handleSearch} className="relative w-1/3 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Wallet ID (e.g. WALLET_15)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
            />
            {foundWallet && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-300">
                <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${foundWallet.suspicionScore > 70 ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    MATCH FOUND
                </div>
              </div>
            )}
          </form>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10"
              title="Reload Dataset"
            >
                <RefreshCw size={20} />
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl font-black shadow-lg shadow-indigo-600/30 transition-all text-sm uppercase tracking-tighter"
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={16} /> : <BrainCircuit size={18} />}
              AI Scan Analysis
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* VIEW: DASHBOARD (Monitor) */}
          {activeTab === 'dashboard' && (
            <div className="flex-1 flex overflow-hidden">
                <div className="w-80 border-r border-white/5 p-6 space-y-8 overflow-y-auto bg-slate-950/20">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Monitor Feed</h3>
                        <Activity size={14} className="text-indigo-500" />
                    </div>

                    {/* Quick Risk Stat */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass p-4 rounded-2xl border border-white/5">
                            <div className="text-[9px] text-slate-500 uppercase font-black">High Risk</div>
                            <div className="text-xl font-bold text-red-500">
                                {RAW_WALLET_DATA.filter(w => w.wallet_score >= 12).length}
                            </div>
                        </div>
                        <div className="glass p-4 rounded-2xl border border-white/5">
                            <div className="text-[9px] text-slate-500 uppercase font-black">Tracked</div>
                            <div className="text-xl font-bold text-cyan-400">{RAW_WALLET_DATA.length}</div>
                        </div>
                    </div>

                    {/* Forensic Search Results */}
                    {foundWallet ? (
                        <div className="space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-2">
                                <Zap size={14} /> Identity Cross-Reference
                            </div>
                            <div className={`p-5 rounded-3xl border ${foundWallet.suspicionScore > 70 ? 'bg-red-500/10 border-red-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                                <div className="text-xl font-black mb-1">{foundWallet.id}</div>
                                <div className="text-[10px] font-bold text-slate-400 mb-4">MATCHED FROM CSV DATA</div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Risk Score</span>
                                        <span className={`font-bold ${foundWallet.suspicionScore > 70 ? 'text-red-500' : 'text-cyan-400'}`}>{foundWallet.wallet_score.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Illicit Ratio</span>
                                        <span className="text-slate-300 font-bold">{(foundWallet.illicit_ratio * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedWallet(foundWallet)}
                                    className="w-full mt-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
                                >
                                    Focus in Graph
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="glass p-6 rounded-3xl border border-dashed border-white/10 text-center opacity-40">
                            <Search className="mx-auto mb-3 text-slate-500" size={24} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Search Wallet ID<br/>to Cross-Ref Score</p>
                        </div>
                    )}

                    {/* AI Scan History Snippet */}
                    <div className="space-y-4">
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.1em] flex items-center justify-between">
                            <span>Analysis Results</span>
                            <History size={12} />
                        </div>
                        {analysis ? (
                           <div className="glass p-5 rounded-3xl border border-indigo-500/20 animate-in fade-in duration-500">
                                <div className="text-xs font-bold text-indigo-400 mb-2">Topology Verified</div>
                                <p className="text-[11px] text-slate-300 leading-relaxed italic">"{analysis.summary.slice(0, 100)}..."</p>
                           </div>
                        ) : (
                           <div className="text-[10px] text-slate-600 text-center font-bold">No recent scans.</div>
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-slate-900/10 relative overflow-hidden">
                    <GraphCanvas data={graphData} onNodeClick={setSelectedWallet} />
                </div>
            </div>
          )}

          {/* VIEW: EXPLORER */}
          {activeTab === 'explorer' && (
            <div className="flex-1 relative bg-slate-950">
              <div className="absolute top-8 left-8 z-10 space-y-2 pointer-events-none">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Graph <span className="text-indigo-500 text-2xl">Explorer</span></h3>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green-500" /> Layering Detection On</span>
                    <span className="flex items-center gap-1.5"><History size={12} className="text-indigo-400" /> {graphData.links.length} Relations</span>
                </div>
              </div>
              <GraphCanvas data={graphData} onNodeClick={setSelectedWallet} />
            </div>
          )}

          {/* VIEW: LEDGER */}
          {activeTab === 'database' && (
            <div className="flex-1 overflow-auto p-12 bg-slate-950/80">
               <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-1">Sheet <span className="text-indigo-500">Registry</span></h2>
                      <p className="text-slate-500 font-medium">Full comparative list of all 25 wallet IDs provided in the dataset.</p>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                      <Download size={16} /> Export Sheet
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RAW_WALLET_DATA.map(item => (
                       <div 
                        key={item.wallet_id}
                        onClick={() => {
                            const node = graphData.nodes.find(n => n.id === item.wallet_id);
                            if (node) { setSelectedWallet(node); setActiveTab('dashboard'); }
                        }}
                        className="glass p-6 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/50 hover:translate-y-[-4px] cursor-pointer transition-all group"
                       >
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-xl font-black group-hover:text-indigo-400 transition-colors">{item.wallet_id}</div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                    item.wallet_score >= 12 ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                                    item.wallet_score >= 10 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                    'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                }`}>
                                    {item.wallet_score >= 12 ? 'High' : item.wallet_score >= 10 ? 'Med' : 'Low'}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">W-Score</span>
                                    <span className="text-xl font-mono font-bold text-slate-200">{item.wallet_score.toFixed(2)}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${item.wallet_score >= 12 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                                        style={{ width: `${((item.wallet_score - 8) / 6) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-slate-600">
                                    <span>IL-RATIO: {(item.illicit_ratio * 100).toFixed(0)}%</span>
                                    <span>MAX: {item.max_score.toFixed(1)}</span>
                                </div>
                            </div>
                       </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* Forensic Detail Sidebar */}
          <aside className={`fixed lg:relative top-0 right-0 h-full w-96 z-30 transition-all duration-500 transform ${selectedWallet ? 'translate-x-0 opacity-100 shadow-[-40px_0_60px_rgba(0,0,0,0.8)]' : 'translate-x-full opacity-0 pointer-events-none'}`}>
            <WalletDetails 
              wallet={selectedWallet} 
              onClose={() => setSelectedWallet(null)} 
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
