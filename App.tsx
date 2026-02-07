
import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import GlobalPriceWidget from './components/GlobalPriceWidget';
import { HistoryItem } from './types';
import { formatCurrency } from './utils/goldMath';
import { 
  Coins, 
  History as HistoryIcon, 
  LayoutDashboard, 
  Trash2, 
  Clock,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calc' | 'history'>('calc');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('gold_calc_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gold_calc_history', JSON.stringify(history));
  }, [history]);

  const handleSaveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
    setActiveTab('history');
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const clearHistory = () => {
    if (confirm('အရောင်းမှတ်တမ်းအားလုံးကို ဖျက်ရန် သေချာပါသလား?')) setHistory([]);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-amber-500/30 flex flex-col">
      {/* Header - respects safe area top */}
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl shadow-lg shadow-amber-500/10">
              <Coins size={18} className="text-slate-950" />
            </div>
            <div>
              <h1 className="text-md font-black tracking-tight text-amber-500 leading-none mb-1">
                ရွှေတွက်ချက်စက်
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                  မြန်မာ့စံနှုန်း
                </p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'calc', label: 'အရောင်း', icon: LayoutDashboard },
              { id: 'history', label: 'မှတ်တမ်း', icon: HistoryIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-400"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-32">
        {activeTab === 'calc' && (
          <Calculator onSave={handleSaveToHistory} />
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black flex items-center gap-2">
                <HistoryIcon size={18} className="text-amber-500" />
                အရောင်းမှတ်တမ်း
              </h2>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-[10px] text-red-400 font-black uppercase tracking-widest"
                >
                  မှတ်တမ်းဖျက်မည်
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-slate-900/30 border-2 border-dashed border-slate-800/50 rounded-3xl p-16 text-center">
                <p className="text-slate-500 text-sm font-bold">မှတ်တမ်း မရှိသေးပါ။</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => toggleExpand(item.id)}
                      className={`bg-slate-900/50 border border-slate-800/50 rounded-[1.5rem] flex flex-col transition-all cursor-pointer overflow-hidden ${isExpanded ? 'ring-2 ring-amber-500/30 bg-slate-900' : ''}`}
                    >
                      <div className="p-5 flex items-center gap-4">
                        <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                          <Coins size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black text-slate-100">
                              {item.weight.kyat} ကျပ် {item.weight.pae} ပဲ {item.weight.yway} ရွေး
                            </h4>
                            <span className="text-base font-black text-amber-500">{formatCurrency(item.totalPrice)}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 opacity-60">
                            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                              <Calendar size={10} />
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="text-slate-600">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-slate-800/50 bg-slate-950/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-500 font-black">ရွှေစျေးနှုန်း</span>
                              <p className="text-sm font-bold text-white">{formatCurrency(item.pricePerKyat)} <span className="text-[9px] opacity-40">/ ကျပ်</span></p>
                            </div>
                            <div className="space-y-1 text-right">
                              <span className="text-[10px] text-slate-500 font-black">အလေးချိန်</span>
                              <p className="text-sm font-bold text-white">{item.weight.kyat}K {item.weight.pae}P {item.weight.yway}Y</p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-900/80 rounded-2xl p-4 space-y-3">
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-bold">ရွှေဖိုး</span>
                                <span className="text-slate-300 font-black">{formatCurrency(item.pricePerKyat * (item.weight.kyat + (item.weight.pae/16) + (item.weight.yway/128)))}</span>
                             </div>
                          </div>

                          <div className="flex gap-2">
                             <button 
                                onClick={(e) => deleteHistoryItem(item.id, e)}
                                className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase flex items-center justify-center gap-2"
                             >
                                <Trash2 size={14} /> မှတ်တမ်းဖျက်မည်
                             </button>
                             <button className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase">
                                ဘောက်ချာထုတ်မည်
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Widget - careful positioning */}
      <GlobalPriceWidget />

      {/* Mobile Bottom Navigation - respects safe area bottom */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/50 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="p-3 flex justify-around items-center">
          {[
            { id: 'calc', label: 'အရောင်း', icon: LayoutDashboard },
            { id: 'history', label: 'မှတ်တမ်း', icon: HistoryIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${
                activeTab === tab.id ? 'text-amber-500' : 'text-slate-500'
              }`}
            >
              <tab.icon size={22} className={activeTab === tab.id ? 'stroke-[2.5px]' : ''} />
              <span className="text-[10px] font-black">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
