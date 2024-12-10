import { randomUUID } from "node:crypto"; // Importa a função para gerar UUIDs
import Scanner from "@codeea/scanner"; // Importa a biblioteca Scanner para entrada de dados
 
// Define o tipo Conta com informações da conta corrente
type Conta = {
  nomeCliente: string;
  numero: number;
  agencia: number;
  saldo: number;
};
 
// Define o tipo Transacao com informações sobre as transações realizadas
type Transacao = {
  id: string;
  valor: number;
  numeroConta: number;
  agencia: number;
  tipo: TipoTransacao;
  operacao: TipoOperacao;
};
 
// Define os tipos possíveis de transação: Crédito (C) ou Débito (D)
type TipoTransacao = "C" | "D";
 
// Define os tipos possíveis de operação: Saque, Depósito, Transferência, PIX
type TipoOperacao = "SAQ" | "DEP" | "TRANSF" | "PIX";
 
// Inicializa variáveis globais
let scanner: Scanner;
const contas: Conta[] = [];
const transacoes: Transacao[] = [];
 
async function main() {
  // Solicita ao usuário o número da agência e da conta
  const agencia = parseInt(await scanner.question("Informe o número da agência: "));
  const numeroConta = parseInt(await scanner.question("Informe o número da conta: "));
  let conta = localizarConta(agencia, numeroConta); // Localiza a conta com base na agência e número da conta
  let operacao = 0;
 
  // Clausula Guarda - Verifica se a conta existe
  if (!conta) {
    console.log("Conta não encontrada!");
    return;
  }
 
  let continuarOperacoes = true; // Variável para controlar o loop de operações
  do {
    imprimeMenu(); // Imprime o menu de operações
    operacao = parseInt(await scanner.question("Informe a operação: ")); // Solicita a operação desejada
 
    switch (operacao) {
      case 0:
        console.log("Obrigado por utilizar nossos serviços!\nVolte Sempre!");
        continuarOperacoes = false; // Termina o loop
        break;
      case 1:
        const saldo = calcularSaldo(agencia, numeroConta);
        console.log(`${conta.nomeCliente}, o saldo da sua conta é de ${saldo}`);
        break;
      case 2:
        const valorDeposito = await scanner.questionFloat("Informe o valor a ser depositado: ");
        if (validarDeposito(valorDeposito)) {
          efetuarDeposito(agencia, numeroConta, valorDeposito);
        } else {
          console.log("Depósito inválido. O valor deve ser maior que zero.");
        }
        break;
      case 3:
        const valorSaque = await scanner.questionFloat("Informe o valor a ser sacado: ");
        efetuarSaque(agencia, numeroConta, valorSaque);
        break;
      case 4:
        imprimirExtrato(agencia, numeroConta);
        break;
      default:
        console.log("Operação inválida");
        break;
    }
  } while (continuarOperacoes); // Continua o loop até o usuário escolher sair
}
 
// Função para imprimir o menu de operações
function imprimeMenu() {
  const menu = `
    1 - CONSULTAR SALDO
    2 - DEPÓSITAR
    3 - SACAR
    4 - EXTRATO
    0 - SAIR
  `;
  console.log(menu);
}
 
// Função para inicializar o banco com uma conta e uma transação
function inicializarBanco() {
  const conta: Conta = {
    nomeCliente: "Cezar Augusto Mezzalira",
    numero: 1234,
    agencia: 1,
    saldo: 100,
  };
  contas.push(conta); // Adiciona a conta à lista de contas
  const transacao: Transacao = {
    id: randomUUID(),
    valor: 100,
    numeroConta: conta.numero,
    agencia: conta.agencia,
    tipo: "C",
    operacao: "DEP",
  };
  transacoes.push(transacao); // Adiciona a transação à lista de transações
}
 
// Função para localizar uma conta pelo número da agência e número da conta
function localizarConta(agencia: number, numeroConta: number) {
  for (let conta of contas) {
    if (conta.agencia === agencia && conta.numero === numeroConta) {
      return conta; // Retorna a conta se encontrar uma correspondência
    }
  }
}
 
// Função para buscar transações de uma conta específica
function buscarTransacoesConta(agencia: number, numeroConta: number) {
  const transacoesConta = transacoes.filter(
    (transacao) => transacao.agencia === agencia && transacao.numeroConta === numeroConta
  );
  return transacoesConta; // Retorna as transações da conta
}
 
// Função para calcular o saldo de uma conta
function calcularSaldo(agencia: number, numeroConta: number) {
  const transacoesConta = buscarTransacoesConta(agencia, numeroConta);
  if (transacoesConta.length === 0) {
    return 0;
  }
 
  let saldo = 0;
 
  for (const transacao of transacoesConta) {
    if (transacao.tipo === "C") {
      saldo += transacao.valor; // Adiciona valor ao saldo se for crédito
    } else {
      saldo -= transacao.valor; // Subtrai valor do saldo se for débito
    }
  }
  return saldo;
}
 
// Função para validar depósito
function validarDeposito(valorDeposito: number): boolean {
  return valorDeposito > 0; // Verifica se o valor do depósito é maior que zero
}
 
// Função para efetuar depósito
function efetuarDeposito(agencia: number, numeroConta: number, valorDeposito: number) {
  for (let conta of contas) {
    if (conta.agencia === agencia && conta.numero === numeroConta) {
      conta.saldo += valorDeposito; // Atualiza o saldo da conta
      break;
    }
  }
 
  const transacao: Transacao = {
    id: randomUUID(),
    valor: valorDeposito,
    numeroConta: numeroConta,
    agencia: agencia,
    tipo: "C",
    operacao: "DEP",
  };
  transacoes.push(transacao); // Adiciona a transação à lista de transações
}
 
// Função para efetuar saque
function efetuarSaque(agencia: number, numeroConta: number, valorSaque: number) {
  const saldoConta = calcularSaldo(agencia, numeroConta);
  if (saldoConta < valorSaque) {
    console.log(`Saldo insuficiente: R$ ${saldoConta.toFixed(2)}`);
    return;
  }
 
  for (let conta of contas) {
    if (conta.agencia === agencia && conta.numero === numeroConta) {
      conta.saldo -= valorSaque; // Atualiza o saldo da conta
      break;
    }
  }
 
  const transacao: Transacao = {
    id: randomUUID(),
    valor: valorSaque,
    numeroConta: numeroConta,
    agencia: agencia,
    tipo: "D",
    operacao: "SAQ",
  };
  transacoes.push(transacao); // Adiciona a transação à lista de transações
}
 
// Função para imprimir o extrato de uma conta
function imprimirExtrato(agencia: number, numeroConta: number) {
  const transacoesConta = buscarTransacoesConta(agencia, numeroConta);
  console.log(`Extrato de transações da conta ${agencia}/${numeroConta}`);
  let saldo = 0;
  for (const transacao of transacoesConta) {
    let valorTransacao = transacao.valor;
    if (transacao.tipo === "D") {
      valorTransacao = transacao.valor * -1; // Ajusta o valor se for débito
    }
    saldo += valorTransacao;
    console.log(`${transacao.operacao} -> R$ ${valorTransacao.toFixed(2)} - ${transacao.tipo}`);
  }
  console.log(`O saldo da conta é de R$ ${saldo.toFixed(0)}`);
}
 
// Executa o programa
(async () => {
  scanner = new Scanner(); // Inicializa o scanner para entrada de dados
  inicializarBanco(); // Inicializa o banco com uma conta e uma transação
  await main(); // Executa a função principal
  scanner.close(); // Fecha o scanner
})();