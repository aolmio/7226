
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'မင်္ဂလာပါ။ ရွှေစျေးကွက်နဲ့ ပတ်သက်ပြီး ဘာများ ကူညီပေးရမလဲခင်ဗျာ။ တွက်ချက်ပုံတွေနဲ့ စျေးကွက်အခြေအနေတွေကို မေးမြန်းနိုင်ပါတယ်။' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `You are an expert in the Myanmar gold market. Answer in Burmese. Explain or answer the following query: ${userMessage}. Use helpful, professional language. If they ask for calculations, explain the units (1 Kyat = 16 Pae, 1 Pae = 8 Yway).` }] }
        ],
        config: {
            systemInstruction: "You are an expert gold market consultant in Myanmar. You understand the traditional units of weight: Kyat, Pae, and Yway. Respond in Burmese language only. You are helpful, precise, and professional."
        }
      });

      const assistantMessage = response.text || "တောင်းပန်ပါတယ်ခင်ဗျာ၊ အချက်အလက် ရှာမတွေ့ပါ။";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "အင်တာနက် ချိတ်ဆက်မှု အခက်အခဲရှိနေပါသည်။" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={20} />
          <h3 className="font-bold text-white text-sm">ရွှေစျေးကွက် အကြံပေး</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">အဆင်သင့်</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-white'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-amber-500 text-slate-900 font-medium rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
              }`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <Loader2 className="animate-spin text-amber-500" size={16} />
              <span className="text-xs text-slate-400">ရှာဖွေပေးနေပါသည်...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="မေးလိုသည်များကို ရေးသားပါ..."
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1.5 p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
