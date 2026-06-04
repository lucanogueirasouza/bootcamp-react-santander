import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, User, DollarSign, Target, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { ProgressBar } from '../components/ProgressBar';
import { maskCurrency, parseCurrencyToNumber, generateUUID } from '../utils/masks';

export const SimulationForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [profissao, setProfissao] = useState('Estudante');

  const [rendaMensal, setRendaMensal] = useState('');
  const [gastosFixos, setGastosFixos] = useState('');
  const [gastosVariaveis, setGastosVariaveis] = useState('');

  const [metaNome, setMetaNome] = useState('');
  const [metaValor, setMetaValor] = useState('');
  const [metaPrazo, setMetaPrazo] = useState('');

  const [perfilConsumo, setPerfilConsumo] = useState('Moderado');
  const [frequenciaImpulso, setFrequenciaImpulso] = useState('Às vezes');
  const [percentualEconomizar, setPercentualEconomizar] = useState('10');

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation Logic per step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!nome.trim()) newErrors.nome = 'Por favor, digite seu nome.';
      if (!idade.trim()) {
        newErrors.idade = 'Por favor, digite sua idade.';
      } else {
        const numIdade = parseInt(idade);
        if (isNaN(numIdade) || numIdade <= 0) {
          newErrors.idade = 'Digite uma idade válida maior que zero.';
        }
      }
    }

    if (step === 2) {
      const renda = parseCurrencyToNumber(rendaMensal);
      if (renda <= 0) newErrors.rendaMensal = 'A renda mensal deve ser maior que R$ 0,00.';
      
      const fixos = parseCurrencyToNumber(gastosFixos);
      const variaveis = parseCurrencyToNumber(gastosVariaveis);
      if (fixos + variaveis > renda) {
        newErrors.gastosVariaveis = 'Atenção: seus gastos totais superam sua renda mensal!';
      }
    }

    if (step === 3) {
      if (!metaNome.trim()) newErrors.metaNome = 'Por favor, descreva seu objetivo.';
      
      const mValor = parseCurrencyToNumber(metaValor);
      if (mValor <= 0) newErrors.metaValor = 'Digite um valor de meta maior que R$ 0,00.';
      
      const numPrazo = parseInt(metaPrazo);
      if (!metaPrazo.trim() || isNaN(numPrazo) || numPrazo <= 0) {
        newErrors.metaPrazo = 'Digite um prazo válido em meses.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    // Compile simulation data
    const simulationId = generateUUID();
    const novaSimulacao = {
      id: simulationId,
      nome: nome.trim(),
      idade: parseInt(idade),
      profissao,
      rendaMensal: parseCurrencyToNumber(rendaMensal),
      gastosFixos: parseCurrencyToNumber(gastosFixos) || 0,
      gastosVariaveis: parseCurrencyToNumber(gastosVariaveis) || 0,
      metaNome: metaNome.trim(),
      metaValor: parseCurrencyToNumber(metaValor),
      metaPrazo: parseInt(metaPrazo),
      perfilConsumo,
      frequenciaImpulso,
      percentualEconomizar: parseInt(percentualEconomizar) || 10,
      dataCriacao: new Date().toISOString(),
    };

    // Save to localStorage
    const savedSimulations = JSON.parse(localStorage.getItem('finai_simulations') || '[]');
    savedSimulations.push(novaSimulacao);
    localStorage.setItem('finai_simulations', JSON.stringify(savedSimulations));

    // Redirect to results page
    navigate(`/resultado/${simulationId}`);
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 animate-fade-in">
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        {/* Progress */}
        <ProgressBar currentStep={step} totalSteps={totalSteps} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 min-h-[350px] justify-between">
          
          {/* STEP 1: Basic Perfil */}
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    Quem é você?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Queremos te conhecer melhor para personalizar a conversa.</p>
                </div>
              </div>

              <Input
                label="Qual é o seu nome?"
                placeholder="Ex: Lucas"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                error={errors.nome}
                id="nome"
              />

              <Input
                label="Quantos anos você tem?"
                placeholder="Ex: 19"
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                error={errors.idade}
                id="idade"
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  O que você faz atualmente?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Estudante', 'Estagiário', 'Trabalhador CLT', 'Autônomo'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProfissao(p)}
                      className={`px-4 py-3 text-sm font-medium rounded-xl border text-center transition-all ${
                        profissao === p
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Finanças Pessoais */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    Suas Finanças
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Quanto entra e quanto sai do seu bolso todo mês?</p>
                </div>
              </div>

              <Input
                label="Qual é a sua renda total mensal?"
                placeholder="R$ 0,00"
                value={rendaMensal}
                onChange={(e) => setRendaMensal(maskCurrency(e.target.value))}
                error={errors.rendaMensal}
                id="rendaMensal"
                helperText="Salário, mesada ou renda de bicos."
              />

              <Input
                label="Quanto você gasta com despesas fixas?"
                placeholder="R$ 0,00"
                value={gastosFixos}
                onChange={(e) => setGastosFixos(maskCurrency(e.target.value))}
                error={errors.gastosFixos}
                id="gastosFixos"
                helperText="Aluguel, contas de luz/água, internet, faculdade."
              />

              <Input
                label="E quanto gasta com despesas variáveis/lazer?"
                placeholder="R$ 0,00"
                value={gastosVariaveis}
                onChange={(e) => setGastosVariaveis(maskCurrency(e.target.value))}
                error={errors.gastosVariaveis}
                id="gastosVariaveis"
                helperText="Rolês com amigos, delivery, compras por impulso."
              />
            </div>
          )}

          {/* STEP 3: Metas Financeiras */}
          {step === 3 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    Sua Próxima Conquista
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Qual é o seu principal objetivo financeiro hoje?</p>
                </div>
              </div>

              <Input
                label="O que você deseja conquistar?"
                placeholder="Ex: Comprar um celular, fazer uma viagem"
                value={metaNome}
                onChange={(e) => setMetaNome(e.target.value)}
                error={errors.metaNome}
                id="metaNome"
              />

              <Input
                label="De quanto dinheiro você precisa para essa meta?"
                placeholder="R$ 0,00"
                value={metaValor}
                onChange={(e) => setMetaValor(maskCurrency(e.target.value))}
                error={errors.metaValor}
                id="metaValor"
              />

              <Input
                label="Em quantos meses planeja alcançar?"
                placeholder="Ex: 6"
                type="number"
                value={metaPrazo}
                onChange={(e) => setMetaPrazo(e.target.value)}
                error={errors.metaPrazo}
                id="metaPrazo"
              />
            </div>
          )}

          {/* STEP 4: Hábitos e Perfil de Consumo */}
          {step === 4 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-lg">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    Seus Hábitos
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Como você se comporta em relação ao dinheiro no dia a dia?</p>
                </div>
              </div>

              {/* Perfil Consumo */}
              <div className="flex flex-col gap-2 text-left">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Como você se classifica financeiramente?
                </label>
                <div className="flex gap-2">
                  {['Poupador', 'Moderado', 'Consumista'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPerfilConsumo(p)}
                      className={`flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        perfilConsumo === p
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequência Impulso */}
              <div className="flex flex-col gap-2 text-left">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Com que frequência faz compras por impulso?
                </label>
                <div className="flex gap-2">
                  {['Raramente', 'Às vezes', 'Frequente'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequenciaImpulso(f)}
                      className={`flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        frequenciaImpulso === f
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Percentual Economizar Slider */}
              <div className="flex flex-col gap-2 text-left">
                <div className="flex justify-between items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Quanto quer poupar da renda?</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{percentualEconomizar}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={percentualEconomizar}
                  onChange={(e) => setPercentualEconomizar(e.target.value)}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>5% (Mínimo)</span>
                  <span>50% (Super Poupador)</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            ) : (
              <div /> // placeholder for layout alignment
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="flex items-center gap-1.5"
              >
                Avançar
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="ai"
                className="flex items-center gap-1.5"
              >
                Ver Diagnóstico
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
