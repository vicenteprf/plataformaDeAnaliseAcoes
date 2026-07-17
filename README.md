# StockVault

Plataforma web para acompanhamento e análise de ações da Bolsa de Valores brasileira, a B3.

![Stack](<https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Supabase%20%2B%20Node.js-blue>)

## Sobre o projeto

O **StockVault** é um projeto de estudo full stack criado para centralizar informações de mercado da B3 em uma interface simples para investidores. A aplicação permite autenticação de usuários, consulta de ações, visualização de indicadores de mercado, favoritos personalizados e página de detalhes com gráfico histórico.

O projeto está organizado em duas partes:

- **Frontend**: aplicação React com TypeScript, Vite, Tailwind CSS, React Router, Supabase e Recharts — deployado na Vercel.
- **Backend**: API Node.js com Express e TypeScript que atua como proxy seguro para a Brapi — deployado na Vercel.

## O que já foi feito

### Autenticação

- Login com e-mail e senha usando Supabase Auth.
- Cadastro com validação básica de campos e senha mínima de 8 caracteres.
- Login social com Google via OAuth (Supabase + Google Cloud Console).
- Contexto global de autenticação (`AuthProvider`) para manter a sessão do usuário.
- Rotas protegidas via `ProtectedRoute` para páginas internas.
- Logout integrado ao Supabase em todas as páginas.

### Página Home

- Cards com dados de mercado em tempo real:
  - IBOVESPA.
  - Variação do dia.
  - Volume negociado.
  - Dólar (USD/BRL).
  - Selic (exibida como valor fixo).
- Tabela de ações com ticker, nome, preço atual e variação percentual.
- Filtros por categoria: Todas, Alta hoje, Baixa hoje.
- Busca manual por ticker com restauração automática da lista ao limpar o campo.
- Botão para carregar mais ações na tabela.
- Sistema de favoritar/desfavoritar ações por usuário.
- Navegação para a página de detalhes ao clicar em uma linha.

### Página de Detalhes

- Consulta de dados detalhados por ticker via backend.
- Exibição de nome, setor, indústria e resumo da empresa.
- Preço atual, variação em reais e variação percentual.
- Cards com dados de negociação: preço mínimo e máximo do dia, volume, Dividend Yield, mínima e máxima de 52 semanas.
- Gráfico histórico de preços com Recharts.
- Seleção de período: 1D, 5D, 1M, 3M.
- Cards de fundamentos: P/L, P/VP, Valor de mercado, Lucro por ação, Funcionários.
- Indicadores ainda não disponíveis exibidos como `-` com nota explicativa.

### Página de Favoritos

- Lista apenas as ações favoritadas pelo usuário logado (busca otimizada — sem carregar todas as ações).
- Cards com total de ações salvas, quantidade em alta, quantidade em baixa, Dólar e Selic.
- Permite remover ações da lista de favoritos.
- Navegação para a página de detalhes de cada ação.

### Backend

- API criada com Node.js, Express e TypeScript.
- Proxy seguro para a Brapi — token nunca exposto no frontend.
- Middleware de autenticação via header `x-api-key`.
- CORS configurado para os domínios permitidos (localhost e produção).
- Cache em memória de 1 minuto para dados de mercado e detalhes de ações, reduzindo chamadas à Brapi.
- Separação em camadas: `routes`, `controllers`, `services`, `middlewares`.
- Endpoints implementados:
  - `GET /` — status da API.
  - `GET /stocks` — lista de ações via Brapi.
  - `GET /stock/:ticker` — detalhe de uma ação.
  - `GET /market` — IBOVESPA e Dólar em tempo real.

### Deploy

- Backend deployado na Vercel com `vercel.json` configurado para serverless.
- Frontend deployado na Vercel com `vercel.json` configurado para suporte ao React Router.
- Variáveis de ambiente configuradas na Vercel para ambos os projetos.

## Tecnologias utilizadas

| Camada         | Tecnologias                  |
| -------------- | ---------------------------- |
| Frontend       | React, TypeScript, Vite      |
| Estilização  | Tailwind CSS                 |
| Roteamento     | React Router DOM v6          |
| Autenticação | Supabase Auth + Google OAuth |
| Banco          | Supabase (PostgreSQL + RLS)  |
| Gráficos      | Recharts                     |
| Ícones        | React Icons                  |
| Backend        | Node.js, Express, TypeScript |
| HTTP Client    | Axios                        |
| APIs externas  | Brapi                        |
| Deploy         | Vercel                       |

## Estrutura do projeto

```text
.
|-- Backend/
|   |-- src/
|   |   |-- controllers/
|   |   |   `-- stockController.ts
|   |   |-- middlewares/
|   |   |   `-- auth.ts
|   |   |-- routes/
|   |   |   `-- stockRoutes.ts
|   |   |-- services/
|   |   |   `-- brapiService.ts
|   |   `-- server.ts
|   |-- vercel.json
|   |-- package.json
|   `-- tsconfig.json
|
|-- Frontend/
|   |-- src/
|   |   |-- components/
|   |   |   `-- ProtectedRoute.tsx
|   |   |-- Context/
|   |   |   |-- AuthContext.tsx
|   |   |   `-- AuthProvider.tsx
|   |   |-- lib/
|   |   |   `-- supabase.ts
|   |   |-- mocks/
|   |   |   `-- sobreEmpresa.mock.ts
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
|   |-- vercel.json
|   |-- .env.example
|   |-- package.json
|   `-- vite.config.ts
|
`-- README.md
```

## Rotas do frontend

| Rota                  | Descrição                    |
| --------------------- | ------------------------------ |
| `/`                 | Redireciona para`/login`     |
| `/login`            | Login do usuário              |
| `/cadastro`         | Cadastro do usuário           |
| `/home`             | Dashboard principal protegido  |
| `/detalhes/:ticker` | Detalhes da ação selecionada |
| `/minhasacoes`      | Lista de favoritos protegida   |

## Endpoints do backend

| Método | Rota               | Descrição                         |
| ------- | ------------------ | ----------------------------------- |
| `GET` | `/`              | Verifica se a API está funcionando |
| `GET` | `/stocks`        | Busca lista de ações na Brapi     |
| `GET` | `/stock/:ticker` | Busca detalhes de uma ação        |
| `GET` | `/market`        | Busca IBOVESPA e Dólar             |

Todas as rotas (exceto `/`) exigem o header `x-api-key` com a chave configurada no `.env` do backend.

## Variáveis de ambiente

### Frontend

Crie um arquivo `.env` dentro da pasta `Frontend` com base em `Frontend/.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
VITE_API_KEY=
VITE_FRONTEND_URL=
```

### Backend

Crie um arquivo `.env` dentro da pasta `Backend`:

```env
BRAPI_TOKEN=
API_KEY=
```

## Como executar

### Backend

```bash
cd Backend
npm install
npm run dev
```

O backend roda em `http://localhost:3333`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173`.

## Integrações

- **Supabase Auth**: login com e-mail/senha, login com Google OAuth, sessão persistida e logout.
- **Supabase Database**: tabela `favorites` com RLS para armazenar favoritos por usuário.
- **Brapi**: cotações, detalhes das ações, dados históricos, IBOVESPA e Dólar — acessados exclusivamente pelo backend.

## Autor

Desenvolvido como projeto de estudo de desenvolvimento web full stack.
