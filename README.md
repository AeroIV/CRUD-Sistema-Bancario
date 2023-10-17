
# Projeto RESTful API Sistema Bancário

## O que é?

Esta é uma API RESTful de um sistema bancário que permite diversos tipos de operações, desde operações de controle de usuário, como criação e exclusão de contas, até operações bancárias, como saques, depósitos e transferências.

## Como usar

⚠️ Importante: Você deve ter o Insomnia instalado em sua máquina! Se não tiver, baixe-o em https://insomnia.rest/download.

1. Clone este repositório para sua máquina local.

2. Instale as dependências necessárias usando `npm install`.

3. Execute a aplicação usando `npm run dev`

4. Abra o Insomnia e crie uma nova coleção.

### Operações:
#### Criando Conta

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para POST

3. Na url coloque http://localhost:8080/contas.

4. Na mude a estrutura para JSON.

5. Use a base abaixo para a criação de usuario.

```javascript
{
    "nome": " ",
    "cpf": " ",
    "data_nascimento": " ",
    "telefone": " ",
    "email": " ",
    "senha": " "
}
```

6. Execute a operação clicando no botão SEND


#### Atualizar Conta

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para PUT

3. Na url coloque http://localhost:8080/contas/:IDdaConta/usuario.

4. Mude na url o :IDdaConta pelo ID de uma conta existente

5. Na mude a estrutura para JSON.

6. Use a base abaixo para a atualizar o usuario.

```javascript
{
    "nome": " ",
    "cpf": " ",
    "data_nascimento": " ",
    "telefone": " ",
    "email": " ",
    "senha": " "
}
```

7. Execute a operação clicando no botão SEND


#### Excluir Conta

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para DELETE

3. Na url coloque http://localhost:8080/contas/:IDdaConta.

4. Mude na url o :IDdaConta pelo ID de uma conta existente

5. Execute a operação clicando no botão SEND


#### Listar Contas

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para GET

3. Na url coloque http://localhost:8080/contas?senha_banco=Cubos123Bank para consultar todas as contas existentes.

4. Execute a operação clicando no botão SEND


#### Procurar uma Conta

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para GET

3. Na url coloque http://localhost:8080/contas/pesquisar?numeroConta=ID&senha_banco=Cubos123Bank para consultar uma conta especifica existente.

4. Mude o ID para um id de uma conta existente.

5. Execute a operação clicando no botão SEND


#### Depositar

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para POST

3. Na url coloque http://localhost:8080/transacoes/depositar.

4. Na mude a estrutura para JSON.

5. Use a base abaixo para a efetuar o deposito.

```javascript
{
	"numero_conta": " ",
	"valor": number
}
```

6. Execute a operação clicando no botão SEND


#### Sacar

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para POST

3. Na url coloque http://localhost:8080/transacoes/sacar.

4. Na mude a estrutura para JSON.

5. Use a base abaixo para a efetuar o saque.

```javascript
{
	"numero_conta": " ",
	"valor": number,
    "senha": " "
}
```

6. Execute a operação clicando no botão SEND


#### Transferência

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para POST

3. Na url coloque http://localhost:8080/transacoes/transferir.

4. Na mude a estrutura para JSON.

5. Use a base abaixo para a efetuar o saque.

```javascript
{
	"numero_conta_origem": " ",
	"numero_conta_destino": " ",
	"valor": number,
	"senha": " "
}
```

6. Execute a operação clicando no botão SEND


#### Ver Saldo

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para GET

3. Na url coloque http://localhost:8080/contas/saldo?numero_conta=ID&senha=123

4. Mude o ID para um id de uma conta existente.

5. Execute a operação clicando no botão SEND


#### Ver Extrato

1. No seu Insomnia, crie uma um HTTP request.

2. Mude o metodo para GET

3. Na url coloque http://localhost:8080/contas/extrato?numero_conta=ID&senha=123

4. Mude o ID para um id de uma conta existente.

5. Execute a operação clicando no botão SEND
