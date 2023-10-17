const dataBase = require('../database/dataBase')
const auth = require('../middleware/auth');

function accountExists(cpf, email) {
        return dataBase.contas.some((conta) => conta.usuario.cpf === cpf || conta.usuario.email === email);
}

function generateAccountNumber() {
        return (Math.floor(Math.random() * 10000) + 1).toString();
}

module.exports = {
    
    // Criar conta
    async createAccount(req, res) {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    
        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
        }
    
        if (accountExists(cpf, email)) {
            return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' });
        }
        
        const novaConta = {
            numero: generateAccountNumber(),
            saldo: 0,
            usuario: {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha,
            },
        };
    
        dataBase.contas.push(novaConta);
    
        res.status(200).json({ mensagem: 'Conta criada com sucesso!' });
    }, 

    //Listar contas
    async listAccounts(req, res) {
        const senhaBanco = req.query.senha_banco;

        if (!senhaBanco) {
            return res.status(400).json({ mensagem: 'A senha do banco é obrigatória!' });
        }

        if (senhaBanco !== dataBase.banco.senha) {
            return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' });
        }

        const contasFormatadas = dataBase.contas.map((conta) => ({
            numero: conta.numero,
            saldo: conta.saldo,
            usuario: {
                nome: conta.usuario.nome,
                cpf: conta.usuario.cpf,
                data_nascimento: conta.usuario.data_nascimento,
                telefone: conta.usuario.telefone,
                email: conta.usuario.email,
            },
        }));
        res.status(200).json(contasFormatadas);
    },

    //Procurar conta
    async searchAccount(req, res) {
        const { numeroConta, senha_banco } = req.query;

        if (!senha_banco) {
            return res.status(400).json({ mensagem: 'A senha do banco é obrigatória!' });
        }
        
        if (senha_banco !== dataBase.banco.senha) {
            return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' });
        }

        const conta = dataBase.contas.find((conta) => conta.numero === numeroConta);

        if (!conta) {
            return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
        }

        const contaFormatada = {
            numero: conta.numero,
            saldo: conta.saldo,
            usuario: {
                nome: conta.usuario.nome,
                cpf: conta.usuario.cpf,
                data_nascimento: conta.usuario.data_nascimento,
                telefone: conta.usuario.telefone,
                email: conta.usuario.email,
            },
        };
        res.status(200).json(contaFormatada);
    },
    
    //Atualizar conta
    async upgradeAccount(req, res) {
        const { numeroConta } = req.params;
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        const conta = dataBase.contas.find((conta) => conta.numero === numeroConta);
        
        if (!conta) {
            return res.status(404).json({ mensagem: 'Número de conta não encontrado!' });
        }

        conta.usuario.nome = nome;
        conta.usuario.cpf = cpf;
        conta.usuario.data_nascimento = data_nascimento;
        conta.usuario.telefone = telefone;
        conta.usuario.email = email;
        conta.usuario.senha = senha;

        res.status(204).send();
    },

    //Deletar conta
    async deleteAccount(req, res) {
        const { numeroConta } = req.params;
        const conta = dataBase.contas.find((conta) => conta.numero === numeroConta);

        if (!conta) {
            return res.status(404).json({ mensagem: 'Número de conta inválido!' });
        }

        if (conta.saldo !== 0) {
            return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
        }

        dataBase.contas = dataBase.contas.filter((conta) => conta.numero !== numeroConta);

        res.status(204).send();
    },

    //Consultar saldo
    async checkBalance(req, res) {
        const { numero_conta, senha } = req.query;

        try {
            if (!numero_conta || !senha) {
                return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios!' });
            }
    
            if (!auth.accountExist(numero_conta)) {
                return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
            }
    
            if (!auth.validatePassword(numero_conta, senha)) {
                return res.status(401).json({ mensagem: 'Senha inválida!' });
            }
    
            const conta = dataBase.contas.find((conta) => conta.numero === numero_conta);
            res.status(200).json({ saldo: conta.saldo });
        } catch (error) {
            res.status(500).json({ mensagem: 'Ocorreu um erro interno.' });
        }
    },

    //Emitir extrato
    async issueExtract(req, res) {
        const { numero_conta, senha } = req.query;
        const conta = dataBase.contas.find((conta) => conta.numero === numero_conta);

        if (!conta || !auth.validatePassword(numero_conta, senha)) {
            return res.status(404).json({ mensagem: 'Conta bancária não encontrada ou senha inválida!' });
        }

        const depositos = dataBase.depositos.filter((deposito) => deposito.numero_conta === numero_conta);
        const saques = dataBase.saques.filter((saque) => saque.numero_conta === numero_conta);
        const transferenciasEnviadas = dataBase.transferencias.filter(
            (transferencia) => transferencia.numero_conta_origem === numero_conta
        );
        const transferenciasRecebidas = dataBase.transferencias.filter(
            (transferencia) => transferencia.numero_conta_destino === numero_conta
        );

        const extrato = {
            depositos,
            saques,
            transferenciasEnviadas,
            transferenciasRecebidas,
          };
        
          res.status(200).json(extrato);
    },

}