
import React, { useState, useMemo, useEffect } from 'react';
import { GoldWeight, HistoryItem } from '../types';
import { SYSTEM_GRAMS } from '../constants';
import { 
  calculateGoldSalesDetails, 
  formatCurrency, 
  convertToDecimalKyat, 
  normalizeWeight,
  gramsToWeight
} from '../utils/goldMath';
import { 
  RefreshCw, 
  TrendingUp, 
  MinusCircle, 
  PlusCircle,
  Gem,
  Hammer,
  Calculator as CalcIcon,
  ArrowLeft,
  CheckCircle2,
  ArrowRightLeft,
  Scale
} from 'lucide-react';

interface CalculatorProps {
  onSave: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSave }) => {
  const [weight, setWeight] = useState<GoldWeight>({ kyat: 0, pae: 0, yway: 0 });
  const [waste, setWaste] = useState<GoldWeight>({ kyat: 0, pae: 0, yway: 0 });
  // Set initial marketPrice to 0 to show blank input
  const [marketPrice, setMarketPrice] = useState<number>(0);
  const [handmadeFee, setHandmadeFee] = useState<number>(0);
  const [stoneFee, setStoneFee] = useState<number>(0);
  const [system, setSystem] = useState<'OLD' | 'NEW'>('OLD');
  const [view, setView] = useState<'form' | 'summary'>('form');
  const [gramInput, setGramInput] = useState<string>('0');

  const details = useMemo(() => {
    return calculateGoldSalesDetails(weight, marketPrice, handmadeFee, stoneFee, waste);
  }, [weight, waste, marketPrice, handmadeFee, stoneFee]);

  const currentGrams = useMemo(() => {
    const decimal = convertToDecimalKyat(weight.kyat, weight.pae, weight.yway);
    return decimal * SYSTEM_GRAMS[system];
  }, [weight, system]);

  useEffect(() => {
    if (document.activeElement?.id !== 'gram-input') {
      setGramInput(currentGrams.toFixed(4));
    }
  }, [currentGrams]);

  const handleWeightChange = (unit: keyof GoldWeight, value: number) => {
    const newWeight = { ...weight, [unit]: value };
    setWeight(newWeight);
  };

  const handleGramChange = (value: string) => {
    setGramInput(value);
    const num = parseFloat(value) || 0;
    const newWeight = gramsToWeight(num, SYSTEM_GRAMS[system]);
    setWeight(newWeight);
  };

  const handleNormalize = (type: 'weight' | 'waste') => {
    if (type === 'weight') setWeight(normalizeWeight(weight));
    else setWaste(normalizeWeight(waste));
  };

  const handleSystemToggle = () => {
    const toSystem = system === 'OLD' ? 'NEW' : 'OLD';
    const newWeight = gramsToWeight(currentGrams, SYSTEM_GRAMS[toSystem]);
    const currentWasteDecimal = convertToDecimalKyat(waste.kyat, waste.pae, waste.yway);
    const wasteGrams = currentWasteDecimal * SYSTEM_GRAMS[system];
    const newWasteWeight = gramsToWeight(wasteGrams, SYSTEM_GRAMS[toSystem]);

    setWeight(newWeight);
    setWaste(newWasteWeight);
    setSystem(toSystem);
  };

  const handleReset = () => {
    setWeight({ kyat: 0, pae: 0, yway: 0 });
    setWaste({ kyat: 0, pae: 0, yway: 0 });
    setHandmadeFee(0);
    setStoneFee(0);
    setGramInput('0');
    setMarketPrice(0);
    setView('form');
  };

  const handleCalculate = () => {
    setWeight(normalizeWeight(weight));
    setWaste(normalizeWeight(waste));
    setView('summary');
  };

  const handleSave = () => {
    if (details.totalAmount <= 0) return;
    onSave({
      weight: { ...weight },
      pricePerKyat: marketPrice,
      totalPrice: details.totalAmount
    });
    setView('form');
  };

  if (view === 'summary') {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] animate-in fade-in slide-in-from-bottom-10 duration-500 overflow-hidden">
        <div className="p-6 flex items-center gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-2xl">
          <button onClick={() => setView('form')} className="p-3 bg-slate-800 rounded-2xl text-slate-400 active:scale-90"><ArrowLeft size={22} /></button>
          <div>
            <h2 className="text-base font-black text-amber-500">တွက်ချက်မှု ရလဒ်</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase">စုစုပေါင်း ကျသင့်ငွေ</span>
            <div className="text-5xl sm:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              {formatCurrency(details.totalAmount)}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center pb-6 border-b border-slate-800">
              <div className="flex flex-col">
                <span className="text-slate-500 font-black text-[9px]">ရွှေစျေး</span>
                <span className="text-white font-black text-lg">{formatCurrency(marketPrice)} <span className="text-[10px] opacity-40">/ ကျပ်</span></span>
              </div>
              <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-[9px] font-black border border-amber-500/20">
                {system === 'OLD' ? 'စနစ်ဟောင်း' : 'စနစ်သစ်'}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-slate-300 font-black text-sm">ရွှေဖိုး</span>
                  <span className="text-[11px] text-slate-500 font-bold">{weight.kyat} ကျပ် {weight.pae} ပဲ {weight.yway} ရွေး</span>
                </div>
                <span className="text-white font-black">{formatCurrency(details.pureGoldValue)}</span>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-slate-300 font-black text-sm">လျော့တွက်</span>
                  <span className="text-[11px] text-slate-500 font-bold">{waste.kyat} ကျပ် {waste.pae} ပဲ {waste.yway} ရွေး</span>
                </div>
                <span className="text-amber-500 font-black">+ {formatCurrency(details.wasteValue)}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-300 font-black text-sm">ကျောက်ဖိုး</span>
                <span className="text-white font-black">{formatCurrency(details.stoneFee)}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-300 font-black text-sm">လက်ခ</span>
                <span className="text-white font-black">{formatCurrency(details.handmadeFee)}</span>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 font-black text-[10px]">အသားတင် အလေးချိန် (ဂရမ်)</span>
              <span className="text-amber-500 font-mono text-lg font-black">{currentGrams.toFixed(3)}g</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/90 flex gap-4">
          <button onClick={() => setView('form')} className="flex-1 py-5 rounded-[1.5rem] bg-slate-800 text-white font-black text-xs active:scale-95">ပြင်ဆင်မည်</button>
          <button onClick={handleSave} className="flex-[2] py-5 rounded-[1.5rem] bg-amber-500 text-slate-950 font-black text-xs shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <CheckCircle2 size={18} /> သိမ်းဆည်းမည်
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 animate-in fade-in duration-700">
      {/* 1. Market Price Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-7 shadow-2xl transition-all">
        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block text-center">
          ရွှေစျေးနှုန်း / ကျပ်
        </label>
        <div className="relative group">
          <TrendingUp className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500/40" size={24} />
          <input
            type="number"
            inputMode="numeric"
            value={marketPrice || ''}
            onChange={(e) => setMarketPrice(parseFloat(e.target.value) || 0)}
            placeholder="စျေးနှုန်းရိုက်ထည့်ပါ"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-7 pl-16 pr-6 text-amber-500 text-3xl font-black focus:outline-none focus:ring-8 focus:ring-amber-500/5 transition-all text-center placeholder:text-slate-800"
          />
        </div>
      </div>

      {/* 2. System Toggle */}
      <div className="bg-slate-900/60 border border-slate-800 p-1.5 rounded-xl flex items-center justify-between">
        <div className="px-4">
          <span className="text-[10px] text-white font-black block">{system === 'OLD' ? 'စနစ်ဟောင်း' : 'စနစ်သစ်'}</span>
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">{SYSTEM_GRAMS[system]}g Standard</span>
        </div>
        <button 
          onClick={handleSystemToggle}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-[10px] font-black border border-slate-700 active:scale-95 transition-all"
        >
          <ArrowRightLeft size={14} className="text-amber-500" />
          စနစ်ပြောင်းရန်
        </button>
      </div>

      {/* 3. Gold Weight Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-7 shadow-2xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-amber-500">
            <PlusCircle size={22} />
            <h2 className="text-xs font-black">ရွှေအလေးချိန်</h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['kyat', 'pae', 'yway'].map((unit) => (
            <div key={unit} className="space-y-3 text-center">
              <label className="text-[10px] text-slate-500 font-black">
                {unit === 'kyat' ? 'ကျပ်' : unit === 'pae' ? 'ပဲ' : 'ရွေး'}
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={weight[unit as keyof GoldWeight] || ''}
                placeholder="0"
                onBlur={() => handleNormalize('weight')}
                onChange={(e) => handleWeightChange(unit as keyof GoldWeight, parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[1.2rem] py-4 text-white focus:outline-none text-2xl font-black text-center shadow-inner"
              />
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-800/50">
          <div className="relative group">
            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input
              id="gram-input"
              type="number"
              inputMode="decimal"
              value={gramInput}
              onChange={(e) => handleGramChange(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white text-xl font-black focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-center"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500">ဂရမ်</span>
          </div>
        </div>
      </div>

      {/* 4. Wastage Section */}
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-7 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-slate-500 mb-6">
          <MinusCircle size={20} className="opacity-50" />
          <h2 className="text-xs font-black">လျော့တွက်</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['kyat', 'pae', 'yway'].map((unit) => (
            <div key={`waste-${unit}`} className="space-y-3 text-center">
              <input
                type="number"
                inputMode="decimal"
                value={waste[unit as keyof GoldWeight] || ''}
                placeholder="0"
                onBlur={() => handleNormalize('waste')}
                onChange={(e) => setWaste(prev => ({ ...prev, [unit]: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 text-white text-center focus:outline-none text-lg font-black"
              />
              <span className="text-[8px] text-slate-600 font-black">{unit === 'kyat' ? 'ကျပ်' : unit === 'pae' ? 'ပဲ' : 'ရွေး'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Extra Fees */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
          <label className="text-[10px] text-slate-500 font-black flex items-center gap-2">
            <Hammer size={12} className="text-amber-500/40" /> လက်ခ
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={handmadeFee || ''}
            onChange={(e) => setHandmadeFee(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none text-base font-black"
          />
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
          <label className="text-[10px] text-slate-500 font-black flex items-center gap-2">
            <Gem size={12} className="text-amber-500/40" /> ကျောက်ဖိုး
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={stoneFee || ''}
            onChange={(e) => setStoneFee(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none text-base font-black"
          />
        </div>
      </div>

      {/* 6. Action Button */}
      <button 
        onClick={handleCalculate}
        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-6 rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all shadow-amber-500/10"
      >
        <CalcIcon size={28} />
        တွက်ချက်မည်
      </button>

      <div className="text-center pt-2">
        <button 
          onClick={handleReset}
          className="text-[10px] text-slate-600 hover:text-red-500 font-black flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw size={12} /> အသစ်ပြန်တွက်မည်
        </button>
      </div>
    </div>
  );
};

export default Calculator;
