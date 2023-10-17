const express = require('express');
const router = express.Router();
const UserController = require('./controller/userController');
const TransactionController = require('./controller/transactionController');
const auth = require('./middleware/auth');


////////////////////     ACCOUNTS     ////////////////////

//Criar conta
router.post('/contas', UserController.createAccount);

//Listar contas
router.get('/contas', UserController.listAccounts);

//Procurar conta
router.get('/contas/pesquisar', UserController.searchAccount);

//Atualizar conta
router.put('/contas/:numeroConta/usuario', auth.validateUpdate, UserController.upgradeAccount);

//Deletar conta
router.delete('/contas/:numeroConta', UserController.deleteAccount);

//Consultar saldo
router.get('/contas/saldo', UserController.checkBalance);

//Emitir extrato
router.get('/contas/extrato', UserController.issueExtract);


////////////////////     TRANSACTIONS     ////////////////////

//Fazer deposito
router.post('/transacoes/depositar', TransactionController.makeDeposit);

//Fazer saque
router.post('/transacoes/sacar', TransactionController.makeWithdrawal);

//Fazer tranferencia
router.post('/transacoes/transferir', TransactionController.makeTransfer);

module.exports = router;