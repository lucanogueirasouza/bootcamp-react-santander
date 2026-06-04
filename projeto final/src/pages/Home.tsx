import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, History, DollarSign, Target, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-12 max-w-4xl mx-auto py-6 sm:py-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center flex flex-col items-center gap-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>IA Generativa para Finanças</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] m-0">
          Aprenda a dominar o seu dinheiro com{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
            Inteligência Artificial
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed m-0">
          Um simulador inteligente feito para jovens. Planeje suas metas, categorize seus gastos e receba conselhos financeiros 100% personalizados de acordo com sua realidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/simular')}
            className="flex items-center justify-center gap-2 group"
          >
            Começar Simulação
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/historico')}
            className="flex items-center justify-center gap-2"
          >
            <History className="w-5 h-5" />
            Ver Histórico
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
        <Card className="flex flex-col gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Simulador de Gastos
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Responda perguntas simples sobre sua renda, despesas fixas e lazer para mapear sua saúde financeira.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Metas de Economia
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Quer comprar um celular, viajar ou guardar dinheiro? Defina seus objetivos e descubra como alcançá-los.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              IA Mentora do Gemini
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Receba insights sob medida e converse diretamente com a IA para esclarecer dúvidas em linguagem simples.
            </p>
          </div>
        </Card>
      </div>

      {/* Safety Notice */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
        <span>Seus dados são confidenciais e ficam salvos apenas localmente no seu navegador.</span>
      </div>
    </div>
  );
};
