# StockVault

Plataforma web para acompanhamento e analise de acoes da Bolsa de Valores brasileira, a B3.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Supabase%20%2B%20Node.js-blue)

## Sobre o projeto

O **StockVault** e um projeto de estudo full stack criado para centralizar informacoes de mercado da B3 em uma interface simples para investidores. A aplicacao permite autenticacao de usuarios, consulta de acoes, visualizacao de indicadores de mercado, favoritos personalizados e pagina de detalhes com grafico historico.

O projeto esta organizado em duas partes:

- **Frontend**: aplicacao React com TypeScript, Vite, Tailwind CSS, React Router, Supabase e Recharts.
- **Backend**: API Node.js com Express e TypeScript para centralizar consultas de dados de mercado.

## O que ja foi feito

### Frontend

- Tela de login com e-mail e senha usando Supabase Auth.
- Tela de cadastro com validacao basica de campos e senha minima.
- Contexto global de autenticacao para manter a sessao do usuario.
- Rotas protegidas para paginas internas da aplicacao.
- Redirecionamento inicial para a pagina de login.
- Home autenticada com dashboard de mercado.
- Listagem inicial de acoes pre-definidas da B3.
- Busca de acao por ticker.
- Botao para carregar mais acoes na tabela.
- Navegacao para detalhes da acao ao clicar em uma linha.
- Sistema de favoritos por usuario usando tabela `favorites` no Supabase.
- Pagina "Favoritos" com resumo das acoes salvas.
- Logout integrado ao Supabase.
- Interface escura com Tailwind CSS.
- Icones com `react-icons`.

### Pagina Home

- Cards com dados de mercado:
  - IBOVESPA.
  - Variacao do dia.
  - Volume negociado.
  - Dolar.
  - Selic fixa exibida na interface.
- Tabela de acoes com:
  - Ticker.
  - Nome da empresa.
  - Preco atual.
  - Variacao percentual.
  - Acao de favoritar/desfavoritar.
- Busca manual por ticker usando a API da Brapi.

### Pagina de detalhes da acao

- Consulta de dados detalhados por ticker.
- Exibicao de nome, setor, industria e resumo da empresa.
- Preco atual, variacao em reais e variacao percentual.
- Cards com dados de negociacao:
  - Preco minimo do dia.
  - Preco maximo do dia.
  - Volume.
  - Dividend Yield.
  - Minima de 52 semanas.
  - Maxima de 52 semanas.
- Grafico historico com Recharts.
- Selecao de periodo do grafico:
  - 1D.
  - 5D.
  - 1M.
  - 3M.
- Cards de fundamentos ja iniciados:
  - P/L.
  - Valor de mercado.
  - Lucro por acao.
  - Numero de funcionarios.
  - Indicadores pendentes exibidos como `-`.

### Pagina de favoritos

- Lista acoes favoritadas pelo usuario logado.
- Cards com:
  - Total de acoes salvas.
  - Quantidade em alta no dia.
  - Quantidade em baixa no dia.
  - Dolar.
  - Selic fixa.
- Permite remover acoes da lista de favoritos.
- Mantem navegacao para a pagina de detalhes da acao.

### Backend

- API criada com Node.js, Express e TypeScript.
- Servidor configurado na porta `3333`.
- Uso de variaveis de ambiente com `dotenv`.
- Integracao com a Brapi usando `axios`.
- Integracao com AwesomeAPI para cotacao do dolar.
- Separacao em camadas:
  - `routes`.
  - `controllers`.
  - `services`.
- Endpoints implementados:
  - `GET /` - status da API.
  - `GET /stocks` - lista de acoes via Brapi.
  - `GET /stock/:ticker` - detalhe de uma acao.
  - `GET /market` - dados de mercado.

## Tecnologias utilizadas

| Camada        | Tecnologias                  |
| ------------- | ---------------------------- |
| Frontend      | React, TypeScript, Vite      |
| Estilizacao   | Tailwind CSS                 |
| Roteamento    | React Router DOM             |
| Autenticacao  | Supabase Auth                |
| Banco         | Supabase                     |
| Graficos      | Recharts                     |
| Icones        | React Icons                  |
| Backend       | Node.js, Express, TypeScript |
| HTTP Client   | Axios                        |
| APIs externas | Brapi, AwesomeAPI            |

## Estrutura do projeto

```text
.
|-- Backend/
|   |-- src/
|   |   |-- controllers/
|   |   |   `-- stockController.ts
|   |   |-- routes/
|   |   |   `-- stockRoutes.ts
|   |   |-- services/
|   |   |   `-- brapiService.ts
|   |   `-- server.ts
|   |-- package.json
|   `-- tsconfig.json
|
|-- Frontend/
|   |-- src/
|   |   |-- components/
|   |   |   `-- ProtectedRoute.tsx
|   |   |-- Context/
|   |   |   `-- AuthContext.tsx
|   |   |-- lib/
|   |   |   `-- supabase.ts
|   |   |-- pages/
|   |   |   |-- cadastro/
|   |   |   |-- detalhe/
|   |   |   |-- home/
|   |   |   |-- login/
|   |   |   `-- minhaacoes/
|   |   |-- service/
|   |   |   `-- stockService.ts
|   |   |-- types/
|   |   |   `-- stock.ts
|   |   |-- App.tsx
|   |   |-- index.css
|   |   `-- main.tsx
|   |-- .env.example
|   |-- package.json
|   `-- vite.config.ts
|
`-- README.md
```

## Rotas do frontend

| Rota                | Descricao                     |
| ------------------- | ----------------------------- |
| `/`                 | Redireciona para `/login`     |
| `/login`            | Login do usuario              |
| `/cadastro`         | Cadastro do usuario           |
| `/home`             | Dashboard principal protegido |
| `/detalhes/:ticker` | Detalhes da acao selecionada  |
| `/minhasacoes`      | Lista de favoritos protegida  |

## Endpoints do backend

| Metodo | Rota             | Descricao                          |
| ------ | ---------------- | ---------------------------------- |
| `GET`  | `/`              | Verifica se a API esta funcionando |
| `GET`  | `/stocks`        | Busca lista de acoes na Brapi      |
| `GET`  | `/stock/:ticker` | Busca detalhes de uma acao         |
| `GET`  | `/market`        | Busca IBOVESPA e dolar             |

## Variaveis de ambiente

### Frontend

Crie um arquivo `.env` dentro da pasta `Frontend` com base em `Frontend/.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_BRAPI_TOKEN=
```

### Backend

Crie um arquivo `.env` dentro da pasta `Backend`:

```env
BRAPI_TOKEN=
```

## Como executar

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

O backend roda em:

```text
http://localhost:3333
```

## Integracoes

- **Supabase Auth**: login, cadastro, sessao do usuario e logout.
- **Supabase Database**: armazenamento dos favoritos na tabela `favorites`.
- **Brapi**: cotacoes, detalhes das acoes, dados historicos e IBOVESPA.
- **AwesomeAPI**: cotacao do dolar no backend.

## Observacoes importantes

- O frontend ainda consulta diretamente a Brapi em `Frontend/src/service/stockService.ts`.
- O backend ja existe e expoe endpoints proprios, mas ainda nao foi conectado ao frontend.
- Os botoes de login/cadastro social com Google e Apple ja aparecem na interface, mas ainda nao executam OAuth.
- Parte dos fundamentos completos ainda esta pendente e aparece como `-`.
- A Selic esta fixa na interface.

## Proximos passos

- Conectar o frontend aos endpoints do backend.
- Criar camada unica de servicos para evitar chamadas diretas a Brapi no frontend.
- Implementar sistema de alertas de preco.
- Criar tabela de alertas no Supabase.
- Ativar O Auth com Google e Apple.
- Melhorar tratamento de erros das chamadas de API.
- Adicionar loading states mais refinados.
- Tornar a Selic dinamica.
- Finalizar indicadores fundamentalistas completos.
- Melhorar responsividade mobile das tabelas e graficos.
- Criar deploy do frontend e backend.

## Autor

Desenvolvido como projeto de estudo de desenvolvimento web full stack.
