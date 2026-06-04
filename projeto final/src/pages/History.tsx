import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, Calendar, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { formatCurrency } from '../utils/masks';

interface SavedSimulation {
  id: string;
  nome: string;
  idade: number;
  profissao: string;
  rendaMensal: number;
  gastosFixos: number;
  gastosVariaveis: number;
  metaNome: string;
  metaValor: number;
  metaPrazo: number;
  perfilConsumo: string;
  frequenciaImpulso: string;
  percentualEconomizar: number;
  dataCriacao: string;
}

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('finai_simulations') || '[]');
    // Sort by creation date descending
    list.sort((a: SavedSimulation, b: SavedSimulation) => 
      new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
    );
    setSimulations(list);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja apagar esta simulação do histórico?')) {
      const updatedList = simulations.filter(sim => sim.id !== id);
      localStorage.setItem('finai_simulations', JSON.stringify(updatedList));
      setSimulations(updatedList);
    }
  };

  const handleClearAll = () => {
    if (confirm('Atenção: isto apagará TODAS as simulações salvas no seu navegador. Deseja continuar?')) {
      localStorage.removeItem('finai_simulations');
      setSimulations([]);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return 'Data desconhecida';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">
            Histórico de Simulações
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Veja seus diagnósticos financeiros salvos neste navegador.
          </p>
        </div>

        {simulations.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 dark:text-rose-400 dark:border-rose-950 dark:hover:bg-rose-950/25"
          >
            Limpar Tudo
          </Button>
        )}
      </div>

      {simulations.length === 0 ? (
        <Card className="flex flex-col items-center text-center p-12 gap-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhuma simulação encontrada</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mt-1 mx-auto leading-relaxed">
              Você ainda não realizou nenhuma simulação de educação financeira. Faça sua primeira simulação agora!
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/simular')}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nova Simulação
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simulations.map((sim) => (
            <Card
              key={sim.id}
              onClick={() => navigate(`/resultado/${sim.id}`)}
              className="flex flex-col gap-4 cursor-pointer hover:border-emerald-500/50 dark:hover:border-emerald-500/30 text-left relative group border border-transparent"
            >
              {/* Card Header info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Simulação de {sim.nome}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(sim.dataCriacao)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(sim.id, e)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-colors"
                    title="Excluir Simulação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Simulation metrics */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-xs">
                <div>
                  <span className="block text-slate-400 font-semibold mb-0.5">Renda Mensal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(sim.rendaMensal)}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold mb-0.5">Perfil</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sim.perfilConsumo}
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/50 pt-2 mt-1">
                  <span className="block text-slate-400 font-semibold mb-0.5">Meta ({sim.metaNome})</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(sim.metaValor)} em {sim.metaPrazo}m
                  </span>
                </div>
              </div>

              {/* Action indicator at bottom */}
              <div className="flex items-center gap-1.5 justify-end text-xs font-semibold text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-1 transition-colors">
                <span>Ver Diagnóstico Completo</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
