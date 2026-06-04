const produtos = {
    "CC": "Cartao de Credito",
    "CD": "Conta Digital",
    "EMP": "Emprestimo",
    "INV": "Investimento"
};

const codigo = gets();

const nomeProduto = produtos[codigo] || "Produto desconhecido";

print(nomeProduto);