import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { formatCurrency } from '../utils/masks';
import { getFinancialInsights, type SimulationData } from '../services/gemini';

export const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string>('');

  useEffect(() => {
    // Load simulation from localStorage
    const savedSimulations = JSON.parse(localStorage.getItem('finai_simulations') || '[]');
    const currentSim = savedSimulations.find((sim: SimulationData) => sim.id === id);

    if (currentSim) {
      setSimulation(currentSim);
      if (currentSim.insights) {
        setInsights(currentSim.insights);
      } else {
        fetchInsights(currentSim);
      }
    } else {
      setError('Simulação não encontrada.');
    }
  }, [id]);

  const fetchInsights = async (data: SimulationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFinancialInsights(data);
      setInsights(result);
      
      // Cache insights in localStorage
      const savedSimulations = JSON.parse(localStorage.getItem('finai_simulations') || '[]');
      const updatedSimulations = savedSimulations.map((sim: SimulationData) => {
        if (sim.id === data.id) {
          return { ...sim, insights: result };
        }
        return sim;
      });
      localStorage.setItem('finai_simulations', JSON.stringify(updatedSimulations));
      
      // Update local state
      setSimulation({ ...data, insights: result });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar insights.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (simulation) {
      fetchInsights(simulation);
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

  // Financial calculations
  const totalExpenses = simulation.gastosFixos + simulation.gastosVariaveis;
  const netSavings = simulation.rendaMensal - totalExpenses;
  
  const fixedPercent = Math.max(0, Math.min(100, Math.round((simulation.gastosFixos / simulation.rendaMensal) * 100)));
  const variablePercent = Math.max(0, Math.min(100, Math.round((simulation.gastosVariaveis / simulation.rendaMensal) * 100)));
  const savingsPercent = Math.max(0, 100 - (fixedPercent + variablePercent));

  // Goal calculations
  const plannedSavingsAmount = (simulation.rendaMensal * simulation.percentualEconomizar) / 100;
  const targetMonthlySavings = simulation.metaValor / simulation.metaPrazo;
  const goalProgressPercentage = Math.round(Math.min(100, (plannedSavingsAmount / targetMonthlySavings) * 100));

  // Parses markdown returned by Gemini to render sections in styled Cards
  const parseMarkdownToSections = (md: string) => {
    if (!md) return [];
    
    // Split by ### and filter out empty elements
    const rawSections = md.split(/###\s+/);
    const parsed = [];

    for (const section of rawSections) {
      if (!section.trim()) continue;
      const lines = section.split('\n');
      const titleLine = lines[0].trim();
      const contentLines = lines.slice(1);
      
      // Format lists, bolding and line breaks into JSX friendly structure
      const content = contentLines.join('\n').trim();
      parsed.push({
        title: titleLine,
        content: content
      });
    }

    return parsed;
  };

  const sections = parseMarkdownToSections(insights);

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 flex flex-col gap-8 animate-fade-in text-left">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => navigate('/historico')}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Histórico
        </button>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/simular')}
            className="flex-1 sm:flex-initial"
          >
            Nova Simulação
          </Button>
          <Button
            variant="ai"
            size="sm"
            onClick={() => navigate(`/chat/${simulation.id}`)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            Tirar Dúvidas com IA
          </Button>
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-emerald-100 font-bold text-xs uppercase tracking-wider">
            Diagnóstico Concluído
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold m-0 mt-1 text-white">
            Parabéns pelo primeiro passo, {simulation.nome}!
          </h2>
          <p className="text-sm text-emerald-500/10 dark:text-emerald-100/80 mt-1.5 max-w-xl">
            Abaixo você encontra o detalhamento visual do seu orçamento e os conselhos exclusivos da nossa IA para conquistar o objetivo: <strong>{simulation.metaNome}</strong>.
          </p>
        </div>
        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center shrink-0">
          <span className="block text-[10px] text-emerald-100 uppercase font-semibold">Perfil Financeiro</span>
          <span className="text-lg font-bold">{simulation.perfilConsumo}</span>
        </div>
      </div>

      {/* Metrics & Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core numbers */}
        <Card className="md:col-span-1 flex flex-col justify-between gap-5">
          <h3 className="text-base font-bold text-slate-800 dark:text-white m-0">
            Resumo do Orçamento
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-sm text-slate-500">Renda Mensal</span>
              <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(simulation.rendaMensal)}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-sm text-slate-500">Despesas Totais</span>
              <span className="font-bold text-rose-500">{formatCurrency(totalExpenses)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Saldo Sobrando</span>
              <span className={`font-bold ${netSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {formatCurrency(netSavings)}
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl text-xs flex gap-2 items-start ${
            netSavings >= 0 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
              : 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
          }`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="m-0 leading-relaxed">
              {netSavings >= 0 
                ? `Você tem um saldo positivo de R$ ${netSavings.toFixed(2)} que pode ser investido ou poupado para suas metas.` 
                : 'Seus gastos superam a sua renda! Dê uma olhada no Raio-X da IA para entender onde economizar.'}
            </p>
          </div>
        </Card>

        {/* Visual Charts Card */}
        <Card className="md:col-span-2 flex flex-col gap-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-white m-0">
            Distribuição dos Gastos e Planejamento da Meta
          </h3>

          <div className="flex flex-col gap-5">
            {/* Gastos Stacked Bar */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400">Como você distribui sua renda mensal:</span>
              <div className="w-full h-7 rounded-xl overflow-hidden flex shadow-inner">
                {fixedPercent > 0 && (
                  <div
                    className="h-full bg-slate-400 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    style={{ width: `${fixedPercent}%` }}
                    title={`Despesas Fixas: ${fixedPercent}%`}
                  >
                    {fixedPercent >= 10 && `Fixas ${fixedPercent}%`}
                  </div>
                )}
                {variablePercent > 0 && (
                  <div
                    className="h-full bg-rose-500/90 flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    style={{ width: `${variablePercent}%` }}
                    title={`Lazer: ${variablePercent}%`}
                  >
                    {variablePercent >= 10 && `Lazer ${variablePercent}%`}
                  </div>
                )}
                {savingsPercent > 0 && (
                  <div
                    className="h-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    style={{ width: `${savingsPercent}%` }}
                    title={`Sobra: ${savingsPercent}%`}
                  >
                    {savingsPercent >= 10 && `Sobra ${savingsPercent}%`}
                  </div>
                )}
              </div>
              <div className="flex gap-4 text-xs font-semibold text-slate-500 justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-400 dark:bg-slate-700" /> Fixas</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500" /> Lazer</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> Sobra</span>
              </div>
            </div>

            {/* Goal Progress Visualizer */}
            <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800/50 pt-4 mt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Adequação da Meta Mensal de Economia:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  goalProgressPercentage >= 100 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                }`}>
                  {goalProgressPercentage}% do Necessário
                </span>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      goalProgressPercentage >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${goalProgressPercentage}%` }}
                  />
                </div>
              </div>
              
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Você precisa guardar **{formatCurrency(targetMonthlySavings)}/mês** para atingir a meta em **{simulation.metaPrazo} meses**. 
                Seu plano de economizar **{simulation.percentualEconomizar}%** da sua renda renderá **{formatCurrency(plannedSavingsAmount)}/mês**. 
                {goalProgressPercentage >= 100 
                  ? ' Excelente! Seu plano é suficiente.' 
                  : ' O valor planejado está abaixo do necessário para cumprir o prazo.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights Section */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-xl">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-none m-0">
              Análise e Conselhos do FinAI Mentor
            </h3>
            <p className="text-xs text-slate-500 mt-1">Gerado de forma personalizada pela Inteligência Artificial.</p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse flex flex-col gap-4 p-6">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error state with retry option */}
        {error && simulation && (
          <Card className="border border-rose-200 dark:border-rose-950 p-6 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-rose-500" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Não foi possível carregar os insights</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {error}
              </p>
            </div>
            <Button variant="primary" onClick={handleRetry}>
              Tentar Novamente
            </Button>
          </Card>
        )}

        {/* Display parsed insights sections */}
        {!loading && !error && sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map((section, idx) => (
              <Card
                key={idx}
                className="flex flex-col gap-3 p-6 border border-slate-100 hover:border-indigo-500/20 dark:border-slate-800/50 dark:hover:border-indigo-500/20 transition-all duration-300"
              >
                <h4 className="text-base font-bold text-slate-900 dark:text-white m-0 pb-2 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <span>{section.title}</span>
                </h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line prose dark:prose-invert max-w-none">
                  {section.content}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action / Bottom bar */}
      <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-slate-200/50 dark:border-slate-800/50 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-sm font-bold text-slate-800 dark:text-white">Ficou com alguma dúvida?</span>
            <span className="text-xs text-slate-500">Converse com o assistente sobre o seu diagnóstico de forma interativa.</span>
          </div>
        </div>
        <Button
          variant="ai"
          onClick={() => navigate(`/chat/${simulation.id}`)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4" />
          Conversar com IA
        </Button>
      </div>
    </div>
  );
};
