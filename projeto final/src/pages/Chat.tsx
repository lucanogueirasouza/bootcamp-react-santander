import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { sendChatMessage, type SimulationData } from '../services/gemini';
import { formatCurrency } from '../utils/masks';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load simulation data and setup welcome message
  useEffect(() => {
    const savedSimulations = JSON.parse(localStorage.getItem('finai_simulations') || '[]');
    const currentSim = savedSimulations.find((sim: SimulationData) => sim.id === id);

    if (currentSim) {
      setSimulation(currentSim);
      
      // Add first introductory message
      const valorMensal = currentSim.metaValor / currentSim.metaPrazo;
      const welcomeText = `Oi, ${currentSim.nome}! Sou o seu mentor do FinAI. 
      
Vi que você tem **${currentSim.idade} anos** e o objetivo de conquistar o(a) **${currentSim.metaNome}** (que custa **${formatCurrency(currentSim.metaValor)}** em **${currentSim.metaPrazo} meses**). 

Para isso, você precisa guardar aproximadamente **${formatCurrency(valorMensal)} por mês**.

Como posso te ajudar no planejamento hoje? Pode me perguntar coisas como:
- *"Onde posso guardar meu dinheiro para render?"*
- *"Como posso cortar gastos variáveis para sobrar mais?"*
- *"E se eu quiser diminuir o prazo da minha meta?"*`;

      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: welcomeText,
          timestamp: new Date()
        }
      ]);
    } else {
      setError('Simulação não encontrada.');
    }
  }, [id]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !simulation || loading) return;

    const userText = inputValue.trim();
    setInputValue('');
    setError(null);

    // 1. Add user message
    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // 2. Call Gemini
    setLoading(true);
    try {
      // Map local messages list to format required by Gemini Chat (excluding welcome)
      const chatHistory = messages
        .filter(msg => msg.id !== 'welcome')
        .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }));

      const responseText = await sendChatMessage(simulation, chatHistory, userText);
      
      const modelMessage: Message = {
        id: Math.random().toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !simulation) {
    return (
      <div className="max-w-md mx-auto text-center py-12 flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ops, algo deu errado!</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{error}</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/')}>
          Voltar ao Início
        </Button>
      </div>
    );
  }

  if (!simulation) return null;

  return (
    <div className="max-w-3xl mx-auto py-2 sm:py-6 flex flex-col h-[calc(100vh-10rem)] sm:h-[650px] animate-fade-in text-left">
      
      {/* Top Header Card */}
      <Card className="rounded-b-none p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/resultado/${simulation.id}`)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Voltar para Resultados"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-base">
                Chat com FinAI Mentor
              </span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse-subtle" />
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">
              Simulação: {simulation.nome} • Meta: {simulation.metaNome}
            </span>
          </div>
        </div>
      </Card>

      {/* Message Log Pane */}
      <div className="flex-1 bg-white/40 dark:bg-slate-900/30 border-x border-slate-100 dark:border-slate-800/30 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => {
          const isAI = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                isAI 
                  ? 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white' 
                  : 'bg-emerald-500 text-white'
              }`}>
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message bubble */}
              <div className={`rounded-2xl px-4 py-3 text-sm shadow-md whitespace-pre-line leading-relaxed ${
                isAI 
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800' 
                  : 'bg-emerald-600 text-white dark:bg-emerald-700'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Network Error display inside chat */}
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-2 max-w-md self-center">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input controls form footer */}
      <Card className="rounded-t-none border-t border-slate-100 dark:border-slate-800/50 p-4 shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pergunte sobre investimentos, economias, metas..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            disabled={loading}
          />
          <Button
            type="submit"
            variant="ai"
            className="!p-3 rounded-xl"
            disabled={loading || !inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
