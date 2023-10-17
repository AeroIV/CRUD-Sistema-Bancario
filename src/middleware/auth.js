const express = require('express');
const dataBase = require('../database/dataBase')



function accountExists(cpf, email) {
    return dataBase.contas.some((conta) => conta.usuario.cpf === cpf || conta.usuario.email === email);
}

function accountExist(numero_conta) {
    return dataBase.contas.some((conta) => conta.numero === numero_conta);
}

function validatePassword(numero_conta, senha) {
    const conta = dataBase.contas.find((conta) => conta.numero === numero_conta);
    return conta && conta.usuario.senha === senha;
}

module.exports = {
    accountExists,
    accountExist,
    validatePassword,
    
    //Verificação da senha do banco
    async passwordBankCheck(req, res, next) {
    const senhaBanco = req.query.senha_banco;

    if (!senhaBanco) {
        return res.status(400).json({
            mensagem: 'A senha do banco é obrigatória!',
        });
    }

    const senhaCorreta = 'Cubos123Bank';

    if (senhaBanco !== senhaCorreta) {
        return res.status(401).json({
            mensagem: 'A senha do banco informada é inválida!',
        });
    }
    
        next();
    },

    //Validação de Update de Usuario
    async validateUpdate(req, res, next) {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        const { numeroConta } = req.params;

        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
        }
    
        const conta = dataBase.contas.find((conta) => conta.numero === numeroConta);
        if (!conta) {
            return res.status(404).json({ mensagem: 'Número de conta inválido!'});
        }

        if (accountExists(cpf, email) && conta.usuario.cpf !== cpf) {
            return res.status(400).json({ mensagem: 'O CPF informado já existe cadastrado!' });
        }

        if (accountExists(cpf, email) && conta.usuario.email !== email) {
            return res.status(400).json({ mensagem: 'O E-mail informado já existe cadastrado!' });
        }

        next();
    },

    async validateDeposit(req, res, next) {
        const { numero_conta, valor } = req.body;
        
        if (!numero_conta || !valor) {
            return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
        }
    
        if (!accountExist(numero_conta)) {
            return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
        }

        if (valor <= 0) {
            return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero!' });
        }
        
        next();
    },

    async validateWithdrawal(req, res, next) {
        const { numero_conta, valor, senha } = req.body;

        if (!numero_conta || !valor || !senha) {
            return res.status(400).json({ mensagem: 'Número da conta, valor e senha são obrigatórios!' });
        }

        const conta = dataBase.contas.find((conta) => conta.numero === numero_conta);

        if (!conta) {
            return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
        }

        if (!validatePassword(numero_conta, senha)) {
            return res.status(401).json({ mensagem: 'Senha inválida!' });
        }

        const valorNumerico = parseFloat(valor);

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            return res.status(400).json({ mensagem: 'O valor do saque deve ser um número maior que zero!' });
        }

        if (conta.saldo < valorNumerico) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente para realizar o saque!' });
        }

        req.conta = conta;
        req.valorSaque = valorNumerico;

        next();
    },

    async validateTransfer(req, res, next) {
        const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

        if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
        }

        const contaOrigem = dataBase.contas.find((conta) => conta.numero === numero_conta_origem);
        const contaDestino = dataBase.contas.find((conta) => conta.numero === numero_conta_destino);

        if (!contaOrigem || !contaDestino) {
            return res.status(404).json({ mensagem: 'Conta bancária de origem ou destino não encontrada!' });
        }

        if (!validatePassword(numero_conta_origem, senha)) {
            return res.status(401).json({ mensagem: 'Senha inválida!' });
        }

        const valorTransferencia = parseFloat(valor);
        if (isNaN(valorTransferencia) || valorTransferencia <= 0) {
            return res.status(400).json({ mensagem: 'O valor da transferência deve ser um número maior que zero!' });
        }

        if (contaOrigem.saldo < valorTransferencia) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
        }

        req.contaOrigem = contaOrigem;
        req.contaDestino = contaDestino;
        req.valorTransferencia = valorTransferencia;

        next();
    },

}