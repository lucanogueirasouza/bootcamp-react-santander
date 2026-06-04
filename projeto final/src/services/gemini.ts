import { GoogleGenerativeAI } from '@google/generative-ai';

export interface SimulationData {
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
  insights?: string;
}

/**
 * Builds the structured system instruction and user prompt for the financial simulation
 */
const buildPrompt = (data: SimulationData): string => {
  const saldoRestante = data.rendaMensal - (data.gastosFixos + data.gastosVariaveis);
  const valorMensalNecessarioMeta = data.metaValor / data.metaPrazo;
  const valorPlanejadoEconomizar = (data.rendaMensal * data.percentualEconomizar) / 100;

  return `
Você é um especialista em educação financeira digital para jovens. Analise a simulação financeira abaixo e crie um relatório de diagnóstico.

DADOS DA SIMULAÇÃO DO USUÁRIO:
- Nome: ${data.nome}
- Idade: ${data.idade} anos
- Ocupação: ${data.profissao}
- Renda Mensal: R$ ${data.rendaMensal.toFixed(2)}
- Despesas Fixas: R$ ${data.gastosFixos.toFixed(2)}
- Despesas Variáveis/Lazer: R$ ${data.gastosVariaveis.toFixed(2)}
- Saldo Restante Atual: R$ ${saldoRestante.toFixed(2)}
- Meta Financeira: "${data.metaNome}"
- Valor da Meta: R$ ${data.metaValor.toFixed(2)}
- Prazo para Alcançar: ${data.metaPrazo} meses
- Meta Mensal Exigida: R$ ${valorMensalNecessarioMeta.toFixed(2)} por mês
- Perfil Declarado: ${data.perfilConsumo}
- Compras por Impulso: ${data.frequenciaImpulso}
- Meta de Economia Planejada: ${data.percentualEconomizar}% da Renda (R$ ${valorPlanejadoEconomizar.toFixed(2)}/mês)

INSTRUÇÕES DE RESPOSTA E ESTILO:
1. Use tom amigável, jovem, motivador e claro. Fale como um mentor próximo.
2. Evite termos técnicos difíceis sem antes explicá-los brevemente.
3. Formate a resposta exatamente no seguinte modelo de seções Markdown (mantenha os títulos exatos com emojis):

### 📊 1. Diagnóstico do seu Perfil Financista
(Faça uma análise rápida do perfil do usuário com base na idade, profissão e o perfil declarado. Diga se ele está no caminho certo e qual o impacto dos hábitos atuais no seu futuro.)

### 🔍 2. Raio-X das suas Contas
(Comente sobre a proporção entre renda, gastos fixos e lazer. Mostre se o saldo restante é saudável. Use exemplos práticos do cotidiano.)

### 🎯 3. Rota para Conquistar: ${data.metaNome}
(Analise se a meta de economizar ${data.percentualEconomizar}% (R$ ${valorPlanejadoEconomizar.toFixed(2)}) é suficiente para atingir R$ ${data.metaValor.toFixed(2)} em ${data.metaPrazo} meses (que exige R$ ${valorMensalNecessarioMeta.toFixed(2)}/mês). Se não for suficiente, dê uma alternativa realista como aumentar o prazo ou ajustar gastos.)

### 💡 4. Dicas de Ouro Personalizadas
(Dê exatamente 3 dicas práticas e curtas que ele possa aplicar hoje para economizar ou gerar renda extra condizente com a realidade dele.)
`;
};

/**
 * Generates dynamic mock insights when no API key is provided
 */
const generateMockInsights = (data: SimulationData): string => {
  const fixosPercent = Math.round((data.gastosFixos / data.rendaMensal) * 100);
  const variaveisPercent = Math.round((data.gastosVariaveis / data.rendaMensal) * 100);
  const saldoRestante = data.rendaMensal - (data.gastosFixos + data.gastosVariaveis);
  const valorMensalNecessarioMeta = data.metaValor / data.metaPrazo;
  const valorPlanejadoEconomizar = (data.rendaMensal * data.percentualEconomizar) / 100;
  
  const isGoalRealistic = valorPlanejadoEconomizar >= valorMensalNecessarioMeta;
  const diff = Math.abs(valorPlanejadoEconomizar - valorMensalNecessarioMeta);

  return `
### 📊 1. Diagnóstico do seu Perfil Financista
Olá, **${data.nome}**! Aos **${data.idade} anos**, como **${data.profissao.toLowerCase()}**, você está em um momento fantástico para aprender a cuidar da sua grana. O seu perfil declarado é **${data.perfilConsumo}**, e você diz que faz compras por impulso **${data.frequenciaImpulso.toLowerCase()}**.
Começar cedo a se preocupar com isso fará de você um adulto financeiramente independente e muito mais tranquilo! O fato de já ter um objetivo claro como **"${data.metaNome}"** mostra que você tem determinação.

### 🔍 2. Raio-X das suas Contas
Vamos dar uma olhada na proporção de onde seu dinheiro está indo:
- **Despesas Fixas (${fixosPercent}% da renda)**: R$ ${data.gastosFixos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. É o custo de manter sua rotina básica de pé.
- **Despesas Variáveis/Lazer (${variaveisPercent}% da renda)**: R$ ${data.gastosVariaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Cuidado para não deixar os pequenos gastos "invisíveis" (como entregas de comida ou assinaturas esquecidas) devorarem seu orçamento.
- **Saldo Sobrando**: R$ ${saldoRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. 

Sua proporção de gastos fixos está ${fixosPercent > 50 ? 'um pouco alta (tente manter abaixo de 50%)' : 'dentro de um limite muito saudável!'} e o lazer consome ${variaveisPercent > 30 ? 'uma boa fatia da sua renda. Atenção para compras por impulso!' : 'uma fatia controlada.'}

### 🎯 3. Rota para Conquistar: ${data.metaNome}
Para atingir o seu sonho de conquistar o(a) **${data.metaNome}**, você precisa acumular **R$ ${data.metaValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** no prazo de **${data.metaPrazo} meses**.
- Isso exige que você guarde pelo menos **R$ ${valorMensalNecessarioMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** todos os meses.
- Você planejou economizar **${data.percentualEconomizar}%** da sua renda, o que equivale a **R$ ${valorPlanejadoEconomizar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** por mês.

${isGoalRealistic 
  ? `🎉 **Ótimas notícias!** Seu plano de poupar R$ ${valorPlanejadoEconomizar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês é suficiente para cobrir os R$ ${valorMensalNecessarioMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} necessários. Se mantiver o foco, você alcançará sua meta até um pouco antes do prazo!` 
  : `⚠️ **Atenção no Planejamento:** Poupar R$ ${valorPlanejadoEconomizar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês deixará um déficit mensal de **R$ ${diff.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** em relação à meta de R$ ${valorMensalNecessarioMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. 
  
  **Duas alternativas para ajustar a rota:**
  1. **Aumentar o prazo** para **${Math.ceil(data.metaValor / valorPlanejadoEconomizar)} meses**, mantendo o valor poupado mensal de R$ ${valorPlanejadoEconomizar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
  2. **Ajustar os gastos de lazer** para conseguir poupar mais R$ ${diff.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} todo mês e atingir no prazo original.`
}

### 💡 4. Dicas de Ouro Personalizadas
1. **Adote a Regra das 24 Horas:** Quando bater aquela vontade de comprar algo por impulso (especialmente online), espere 24 horas. Se no dia seguinte você ainda achar essencial, compre. Isso evita 80% das compras emocionais.
2. **Separe o Dinheiro da Meta Primeiro:** Assim que sua renda (salário ou mesada) entrar na conta, transfira imediatamente os R$ ${valorPlanejadoEconomizar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para uma conta separada ou caixinha de rendimento. Quem deixa para guardar o que "sobra" no fim do mês acaba não guardando nada.
3. **Crie Renda Extra com o Desapego:** Dê uma olhada no seu quarto. Roupas, livros ou eletrônicos que você não usa há mais de 6 meses podem ser vendidos em sites de desapego. Isso dará uma turbinada inicial no valor da sua meta de ${data.metaNome}!
`;
};

/**
 * Main Service call to generate analysis insights
 */
export const getFinancialInsights = async (data: SimulationData): Promise<string> => {
  const apiKey = localStorage.getItem('gemini_api_key');

  if (!apiKey) {
    // Delay slightly to simulate a real network request and show the loader
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateMockInsights(data);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = buildPrompt(data);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating Gemini insights:', error);
    throw new Error('Falha ao conectar com o Gemini AI. Verifique se a sua chave de API é válida.');
  }
};

/**
 * Service call to handle the chat message context
 */
export const sendChatMessage = async (
  simulation: SimulationData,
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userMessage: string
): Promise<string> => {
  const apiKey = localStorage.getItem('gemini_api_key');

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Dynamic mock response for the chat based on user keywords
    const msgLower = userMessage.toLowerCase();
    
    if (msgLower.includes('invest') || msgLower.includes('onde guardar')) {
      return `Como você é ${simulation.profissao.toLowerCase()} e tem ${simulation.idade} anos, para sua meta de "${simulation.metaNome}" no prazo de ${simulation.metaPrazo} meses, o ideal é focar em segurança e liquidez rápida. 
      
Evite renda variável (ações) para o dinheiro desta meta, pois o prazo é curto. Sugiro colocar em:
1. **Contas digitais com rendimento automático** (100% do CDI).
2. **Caixinhas de bancos digitais** específicas para metas.
3. **Tesouro Selic** (se quiser uma segurança de nível nacional).

Ficou claro? Quer saber quanto rende aproximadamente na caixinha?`;
    }

    if (msgLower.includes('gasto') || msgLower.includes('economizar') || msgLower.includes('cortar')) {
      return `Analisando seu orçamento, sua renda é de R$ ${simulation.rendaMensal.toFixed(2)} e você gasta R$ ${simulation.gastosVariaveis.toFixed(2)} em lazer/variáveis. 
      
Para economizar, tente focar nos gastos pequenos recorrentes (como taxas de entrega de comida ou assinaturas de streaming que não usa todo dia). 
Se você economizar apenas 10% do seu lazer, já sobram mais R$ ${(simulation.gastosVariaveis * 0.1).toFixed(2)} por mês. Que tal começar anotando tudo em um papel por uma semana?`;
    }

    if (msgLower.includes('meta') || msgLower.includes('prazo') || msgLower.includes('comprar')) {
      const valorMensal = simulation.metaValor / simulation.metaPrazo;
      return `Sua meta é comprar o(a) **${simulation.metaNome}** no valor de **R$ ${simulation.metaValor.toFixed(2)}** em **${simulation.metaPrazo} meses**, o que exige **R$ ${valorMensal.toFixed(2)}** por mês. 

Se achar apertado, recomendo estender o prazo para **${simulation.metaPrazo * 2} meses**, reduzindo a parcela mensal pela metade (R$ ${(valorMensal/2).toFixed(2)}/mês), o que vai aliviar muito o seu dia a dia!`;
    }

    return `Entendi a sua dúvida! Com base nas suas finanças (Renda: R$ ${simulation.rendaMensal.toFixed(2)}, Meta: ${simulation.metaNome}), o segredo é ter disciplina. 

Você gostaria de falar sobre **como economizar mais**, **onde colocar o dinheiro para render** ou **como ajustar o prazo da sua meta**?`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // System context to inject into chat
    const contextPrompt = `
Você é o mentor financeiro do usuário ${simulation.nome} (${simulation.idade} anos, ${simulation.profissao}).
Suas finanças: Renda R$ ${simulation.rendaMensal.toFixed(2)}, Gastos Fixos R$ ${simulation.gastosFixos.toFixed(2)}, Lazer R$ ${simulation.gastosVariaveis.toFixed(2)}.
Sua meta: "${simulation.metaNome}" no valor de R$ ${simulation.metaValor.toFixed(2)} em ${simulation.metaPrazo} meses.
Responda de forma curta, prestativa e bem-humorada.
`;

    // Map local history to Google AI SDK structure
    // Combine context with current request using chat
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `Olá. Por favor, adote esta personalidade e use estes dados como base de contexto das minhas finanças: ${contextPrompt}` }]
        },
        {
          role: 'model',
          parts: [{ text: `Entendido! Sou o mentor financeiro de ${simulation.nome}. Estou pronto para ajudar a planejar e economizar para conquistar o(a) ${simulation.metaNome}!` }]
        },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini Chat:', error);
    throw new Error('Falha ao enviar mensagem para a IA. Verifique sua chave API.');
  }
};
