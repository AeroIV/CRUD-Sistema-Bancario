const dataBase = require('../database/dataBase')
const auth = require('../middleware/auth');

module.exports = {

    //Fazer deposito
    async makeDeposit(req, res) {
        const { numero_conta, valor } = req.body;
        const conta = dataBase.contas.find((conta) => conta.numero === numero_conta);
        const valorNumerico = parseFloat(valor);

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            return res.status(400).json({ mensagem: 'O valor do depósito deve ser um número maior que zero!' });
        }
        conta.saldo += valorNumerico;

        const depositos = {
            data: new Date().toLocaleString(),
            numero_conta,
            valor: valorNumerico,
        };
        dataBase.depositos.push(depositos);

        res.status(204).send();
    },

    //Fazer saque
    async makeWithdrawal(req, res) {
        auth.validateWithdrawal(req, res, () => {
            const { conta, valorSaque } = req;

            conta.saldo -= valorSaque;

            const saque = {
                data: new Date().toLocaleString(),
                numero_conta: conta.numero,
                valor: valorSaque,
            };
            dataBase.saques.push(saque);
            res.status(204).send();
        });
    },

    //Fazer transferencia
    async makeTransfer(req, res) {
        try {
            auth.validateTransfer(req, res, () => {
                const { contaOrigem, contaDestino, valorTransferencia } = req;

                contaOrigem.saldo -= valorTransferencia;
                contaDestino.saldo += valorTransferencia;

                const transferencia = {
                    data: new Date().toLocaleString(),
                    numero_conta_origem: contaOrigem.numero,
                    numero_conta_destino: contaDestino.numero,
                    valor: valorTransferencia,
                };
                dataBase.transferencias.push(transferencia);
                res.status(204).send();
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro interno no servidor.' });
        }
    },

}