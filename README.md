# Blog API

API para gerenciamento de conteúdo de blog construída para uma licão do
[The Odin Project](https://theodinproject.com).

[Confira a API em funcionamento](https://express-blog-api.adrielfaria1.repl.co/).

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

## Índice

- [Executando o projeto localmente](#executando-o-projeto-localmente)
- [Como funciona a autenticação de usuários](#como-funciona-a-autenticação-de-usuários)
- [Modelo de dados](#modelo-de-dados)
  - [User](#user)
  - [Comment](#comment)
  - [Post](#post)
  - [Refresh token](#refresh-token)
- [Rotas disponíveis](#rotas-disponíveis)
  - [Listagem e detalhes](#listagem-e-detalhes)
  - [Criação de recursos](#criação-de-recursos)
    - [Criação de usuário](#rota-1---criação-de-usuário)
    - [Criação de post](#rota-2---criação-de-post)
    - [Criação de comentário](#rota-3---criação-de-comentário)
  - [Atualização de recursos](#atualização-de-recursos)
    - [Alterar usuário](#rota-1---alterar-usuário)
    - [Alterar post](#rota-4---alterar-post)
  - [Remoção de recursos](#remoção-de-recursos)
  - [Autenticação](#autenticação)
    - [Login](#rota-1---login)
    - [Refresh token](#rota-2---refresh-token)

## Executando o projeto localmente

Para executar esse projeto localmente você precisa ter o
[Node e o npm](https://nodejs.org/en/) instalados em sua máquina.

1. Baixe os arquivos do projeto

2. Abra a pasta no terminal e execute o comando npm install para instalar as
   dependências

3. Faça uma cópia do arquivo .env.example e renomeie para .env

4. Preencha as variáveis do arquivo .env conforme as instruções a seguir

   - `DB_URL`

     - URL de conexão com o banco de dados mongodb que você pretende usar com
       o projeto

   - `PORT`

     - Porta em que o servidor será executado

   - `TOKEN_SECRET`

     - String de caracteres que será utilizada para criptografar os tokens de
       autenticação

5. Volte a pasta do projeto aberta no terminal e execute o comando `npm run dev`,
   se tudo estiver configurado corretamente você deve ver as mensagens
   `SERVER RUNNING` e `CONNECTED TO DATABASE`.

[Voltar ao início](#blog-api)

## Como funciona a autenticação de usuários

Para a autenticação de usuários a API utiliza tokens de autenticações que são
gerados no momento de cadastro e login.

Ao se cadastrar ou fazer login na API o usuário recebe duas strings: um token,
que tem validade de 30 minutos, e um refresh token, que tem duração de 30 dias.

Nas chamadas subsequentes a API que requerem a autenticação do usuário, tudo que
é preciso passar na requisição para que o sistema identifique o login do usuário
é o token recebido, o que elimina a necessidade de envio da senha.

Caso o usuário faça uma requisição e o token se encontre inválido, tudo que o
usuário precisa passar para receber um novo token é o refresh token, eliminando
novamente a necessidade de envio da senha.

O login com email e senha só será necessário novamente quando o refreshToken
estiver expirado ou quando o usuário se conectar por um novo dispositivo.

Além disso, a estratégia de autenticação com tokens foi implementada de forma que
o usuário não possa acessar o sistema atráves de dois dispositivos
simultâneamente após o token ter expirado.

[Voltar ao início](#blog-api)

## Modelo de dados

A API está divida em quatro coleções: Users, Comments, RefreshTokens e Posts. A
seguir estão os campos que cada uma possui e o que significam.

[Voltar ao início](#blog-api)

### User

Usuário registrado do sistema, se refere tanto à autores de publicações como de
comentários.

| Campo        | Tipo    | Valor padrão | Descrição                                              |
| ------------ | ------- | ------------ | ------------------------------------------------------ |
| \_id         | string  | -            | Identificação única do usuário gerada pela aplicação   |
| email        | string  | -            | Email do usuário, precisa ser único                    |
| firstName    | string  | -            | Nome do usuário                                        |
| lastName     | string  | -            | Sobrenome do usuário                                   |
| password     | string  | -            | Senha do usuário criptografada                         |
| refreshToken | string  | -            | Referência ao token de re-autenticação                 |
| isAdmin      | boolean | `false`      | Identifica se o usuário tem permissão de administrador |
| isAuthor     | boolean | `false`      | Identifica se o usuário tem permissão para criar posts |

### Comment

Comentário deixado em alguma publicação por algum usuário registrado do sistema.

| Campo     | Tipo   | Valor padrão | Descrição                                                   |
| --------- | ------ | ------------ | ----------------------------------------------------------- |
| \_id      | string | -            | Identificação única do comentário gerada pela aplicação     |
| content   | string | -            | Conteúdo do comentário                                      |
| author    | string | -            | Referência ao usuário que fez o comentário                  |
| post      | string | -            | Referência ao post ao qual o comentário se refere           |
| createdAt | date   | -            | Data e hora em que o documento foi criado                   |
| updatedAt | date   | -            | Data e hora da última vez em que o documento foi atualizado |

### Post

Postagem feita no blog por um usuário com privilégios de autor.

| Campo       | Tipo    | Valor padrão | Descrição                                                   |
| ----------- | ------- | ------------ | ----------------------------------------------------------- |
| \_id        | string  | -            | Identificação única de uma publicação no blog               |
| title       | string  | -            | Título da postagem                                          |
| content     | string  | -            | Conteúdo da postagem                                        |
| author      | string  | -            | Referência ao usuário que fez a postagem                    |
| isPublished | boolean | `false`      | Identifica de a postagem foi publicada ou não               |
| createdAt   | date    | -            | Data e hora em que o documento foi criado                   |
| updatedAt   | date    | -            | Data e hora da última vez em que o documento foi atualizado |

### Refresh Token

Coleção utilizada na lógica de re-autenticação de usuários através da geração de
novos Json Web Tokens.

| Campo     | Tipo   | Valor padrão | Descrição                                                                     |
| --------- | ------ | ------------ | ----------------------------------------------------------------------------- |
| \_id      | string | -            | Identificação única de uma publicação no blog                                 |
| user      | string | -            | Referência ao usuário a que o documento pertence                              |
| createdAt | date   | -            | Data e hora em que o documento foi criado, determina a expiração do documento |

[Voltar ao início](#blog-api)

## Rotas disponíveis

Para as rotas que requerem autenticação é preciso passar o token obtido durante
o login ou cadastro atráves do Bearer token.

### Listagem e detalhes

|  #  | Método | Rota                  |                                                                            |
| :-: | ------ | --------------------- | -------------------------------------------------------------------------- |
|  1  | `GET`  | `/users`              | Retorna array com todos os usuários cadastrados                            |
|  2  | `GET`  | `/users/:id`          | Retorna detalhes do usuário com `_id` igual a `:id`                        |
|  3  | `GET`  | `/posts`              | Retorna array de posts publicados                                          |
|  4  | `GET`  | `/posts/:id`          | Retorna detalhes do post com `_id` igual a `:id`                           |
|  5  | `GET`  | `/posts/:id/comments` | Retorna array com os comentários referentes ao post de `_id` igual a `:id` |

As rotas 1, 3 e 5 retornam o conteúdo em páginas de 10 itens. Para buscar os
itens de uma página específica basta passar o atributo `page` na forma de query
parameter, como mostrado no exemplo a segur:

```bash
/posts?page=2
```

Quando uma página possui uma próxima página ou uma página anterior, sua url
relativa é retornada nos parâmetros `prev` e `next` do json retornado, seguindo
o exemplo anterior, teríamos na resposta algo como o seguinte:

```javascript
{
  posts: [...],
  prev: '/posts?page=1',
  next: '/posts?page=3',
}
```

[Voltar ao início](#blog-api)

### Criação de recursos

|  #  | Método | Rota                      |                                                                                 |
| :-: | ------ | ------------------------- | ------------------------------------------------------------------------------- |
|  1  | `POST` | `/users`                  | Cria um novo usuário                                                            |
|  2  | `POST` | `/posts`                  | Cria uma nova postagem, requer autenticação e privilégio de autor               |
|  3  | `POST` | `/posts/:postId/comments` | Cria um novo comentário no post de `_id` igual a `:postId`, requer autenticação |

#### Rota #1 - Criação de usuário

A rota de criação de usuários espera que o body da requisição tenha um formato
similar ao mostrado no exemplo a seguir, no qual a senha deve possuir pelo menos
8 caracteres, ter pelo menos uma letra mínuscula, uma maiúscula, um número e um
símbolo:`

```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao.silva@exemplo.com",
  "password": "senHa?123",
  "password2": "senHa?123"
}
```

Caso não ocorram erros e o usuário seja criado com sucesso, o sistema já
realizará o login do usuário e retornará o token de autenticação e o
refreshToken, como mostrado no exemplo a seguir:

```json
{
  "token": "tokenDeAutenticacao.sequenciaAleatoria.!123456?",
  "refreshToken": "refreshToken.sequenciaAleatoria.!123456?"
}
```

#### Rota #2 - Criação de post

A rota de criação de posts espera que o body da requisição tenha um formato
similar ao mostrado no exemplo a seguir:`

```json
{
  "title": "Olá mundo",
  "content": "Meu primeiro post"
}
```

#### Rota #3 - Criação de comentário

A de criação de comentários espera que o body da requisição tenha um formato
similar ao mostrado no exemplo a seguir:`

```json
{
  "content": "Meu primeiro comentário"
}
```

[Voltar ao início](#blog-api)

### Atualização de recursos

Para alterar um usuário diferente do usuário logado, ou um post que não tem o
usuário logado como autor, é necessário ter privilégios de administrador.

|  #  | Método  | Rota                 |                                                                |
| :-: | ------- | -------------------- | -------------------------------------------------------------- |
|  1  | `PATCH` | `/users/:id`         | Atualiza o usuário de `_id` igual a `:id`, requer autenticação |
|  2  | `PATCH` | `/users/:id/author`  | Liga/desliga permissão de autor para usuário de `_id` igual a `:id`, requer autenticação e privilégio de administrador |
|  3  | `PATCH` | `/users/:id/admin`   | Liga/desliga permissão de administrador para o usuário de `_id` igual a `:id`, requer autenticação e privilégio de administrador |
|  4  | `PATCH` | `/posts/:id`         | Atualiza o post de `_id` igual a `:id`, requer autenticação    |
|  5  | `PATCH` | `/posts/:id/publish` | Publica o post de `_id` igual a `:id`, requer autenticação     |

[Voltar ao início](#blog-api)

#### Rota #1 - Alterar usuário

A rota de alteração de usuário permite a modificação de seu nome e sobrenome, e
espera que o body da requisição tenha um formato similar aos exemplos a seguir:

```json
{
  "firstName": "Jonas",
  "lastName": "da Silva"
}
```

```json
{
  "firstName": "Jonas"
}
```

```json
{
  "lastName": "da Silva"
}
```

#### Rota #4 - Alterar post

A rota de alteração de post permite a modificação de seu título e conteúdo, e
espera que o body da requisição tenha um formato similar aos exemplos a seguir:

```json
{
  "title": "Novo título",
  "content": "Novo conteúdo"
}
```

```json
{
  "title": "Novo título"
}
```

```json
{
  "content": "Novo conteúdo"
}
```

[Voltar ao início](#blog-api)

### Remoção de recursos

Para remover um usuário diferente do usuário logado, ou um post que não tem o
usuário logado como autor, ou um comentário que também não atende a esse
critério, é necessário ter privilégios de administrador.

|  #  | Método  | Rota                 |                                                                 |
| :-: | ------- | -------------------- | --------------------------------------------------------------- |
|  1  | `DELETE` | `/users/:id`        | Remove o usuário de `_id` igual a `:id`, requer autenticação    |
|  2  | `DELETE` | `/posts/:id`        | Remove o post de `_id` igual a `:id`, requer autenticação       |
|  3  | `DELETE` | `/comments/:id`     | Remove o comentário de `_id` igual a `:id`, requer autenticação |

[Voltar ao início](#blog-api)

### Autenticação

|  #  | Método  | Rota                          |                                                     |
| :-: | ------- | ----------------------------- | --------------------------------------------------- |
|  1  | `POST`  | `/users/authenticate`         | Gera o token e o refreshToken                       |
|  2  | `POST`  | `/users/authenticate/refresh` | Gera um novo token a partir do refreshToken passado |

#### Rota #1 - Login

A rota de login espera que o body da requisição tenha um formato similar ao
mostrado no exemplo a seguir:

```json
{
  "email": "joao.silva@email.com",
  "senha": "senHa?123"
}
```

Caso o login seja bem sucessido, a resposta dessa requisição fornecerá o token e
o refreshToken:

```json
{
  "token": "tokenDeAutenticacao.sequenciaAleatoria.!123456?",
  "refreshToken": "refreshToken.sequenciaAleatoria.!123456?"
}
```

#### Rota #2 - Refresh token

Para gerar um novo token e seguir com o usuário autenticado basta enviar o
refreshToken para essa rota atráves do Bearer token e um novo token será
retornado.

[Voltar ao início](#blog-api)
