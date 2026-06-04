// IMPORTANTE: As funções "gets" e "print" são acessíveis globalmente e têm as seguintes funcionalidades: 
// - "gets": lê UMA linha com dados de entrada (inputs) do usuário;
// - "print": imprime um texto de saída (output) e pula uma linha ("\n") automaticamente;

// Lê a linha de entrada do usuário
const entrada = gets();

// Separa o nome e o saldo em centavos
const [nome, saldoCentavosStr] = entrada.split(" ");
const saldoCentavos = parseInt(saldoCentavosStr);

// Converte para reais
const reais = Math.floor(saldoCentavos / 100);
const centavos = saldoCentavos % 100;

// Formata os centavos com duas casas
const saldoFormatado = `${reais},${centavos.toString().padStart(2, "0")}`;

// Exibe a mensagem
print(`Bem-vindo, ${nome}! Seu saldo é R$${saldoFormatado}`);