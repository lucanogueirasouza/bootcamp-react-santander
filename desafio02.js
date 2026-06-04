const entrada = gets();

const [nome, saldoCentavosStr] = entrada.split(" ");
const saldoCentavos = parseInt(saldoCentavosStr);

const reais = Math.floor(saldoCentavos / 100);
const centavos = saldoCentavos % 100;

const saldoFormatado = `${reais},${centavos.toString().padStart(2, "0")}`;

print(`Bem-vindo, ${nome}! Seu saldo é R$${saldoFormatado}`);