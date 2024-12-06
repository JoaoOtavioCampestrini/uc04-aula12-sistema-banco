/**
 * Crie um programa que simule as operações de uma conta corrente,
 * onde o cliente deve poder fazer o seguinte:
 * - Consultar saldo,
 * - Fazer um depósito,
 * - Fazer um saque
 * - Imprimir um extrato.
 * Utilize estruturas de dados em memória
 * para armazenar as informações da conta e
 * das operações feitas pela conta.
 */
 
import Scanner from "@codeea/scanner";
 
let scanner: Scanner
 
type Conta = {
  nomeCliente: string;
  numero: number;
  agenda: number;
  saldo: number;
}
 
type transacao = {
  id: string;
  valor: number;
  tipo: TipoTransacao;
  operacao: TipoOperacao;
}
 
type TipoTransacao = "E" | "S";
 
type TipoOperacao = "SAQ" | "DEP" | "TRANSF" | "PIX" |
 
 
 
async function main () {}
  let operacao = 0;
 
  do {
    imprimeMenu();
    operacao = parseInt (await scanner.question("informe a operação: "));
 
    if (operacao === 0) {
      console.log("obrigado por utilizar nossos serviços!\nVolte sempre! ");
      break;
  }
}
 
 
  //OPERAÇÕES
  //1 SALDO
  //2 DEPOSITO
  //3 SAQUE
  //4 EXTRATO
 
 
  while (true);
 
(async()=> {
  scanner = new Scanner
  await main();
})