# 📈 StockVault

> Plataforma web para acompanhamento de ações da Bolsa de Valores brasileira (B3) em tempo real.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

![Stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Supabase-blue)

---

## 🖥️ Sobre o Projeto

O **StockVault** é uma aplicação web desenvolvida para investidores acompanharem o mercado de ações da B3 de forma simples e centralizada. O usuário pode visualizar cotações em tempo real, favoritar ações de interesse e consultar dados detalhados de cada empresa.

---

## ✅ Funcionalidades Implementadas

- 🔐 **Autenticação** — Cadastro e login com e-mail/senha via Supabase Auth
- 📊 **Home** — Listagem de ações da B3 com preço e variação em tempo real
- 🔍 **Busca** — Pesquisa de ação por ticker (ex: PETR4, VALE3)
- ⭐ **Favoritos** — Adicionar e remover ações de uma lista personalizada
- 📈 **Detalhe da Ação** — Gráfico histórico de preços com seleção de período (1D, 5D, 1M, 3M), fundamentos e resumo da empresa
- 📡 **Dados de Mercado** — IBOVESPA, variação do dia, volume negociado, dólar e Selic

---

## 🛠️ Stack

| Camada | Tecnologia |

|---|---|

| Frontend | React 18 + TypeScript |

| Estilização | Tailwind CSS |

| Roteamento | React Router v6 |

| Autenticação / Banco | Supabase |

| Gráficos | Recharts |

| Bundler | Vite |

---

## 🗂️ Estrutura do Projeto

```

src/

├── Context/          ← Estado global de autenticação

├── components/       ← Componentes reutilizáveis (ex: rotas protegidas)

├── lib/              ← Configuração do cliente Supabase

├── service/          ← Integração com API de cotações

├── types/            ← Tipagem TypeScript

└── pages/

    ├── login/

    ├── cadastro/

    ├── home/

    ├── detalhe/

    └── minhaacoes/

```

---

## 🚀 Próximos Passos

### 1. 🔔 Sistema de Alertas de Preço

Permitir que o usuário defina um preço alvo para uma ação e receba uma notificação por e-mail quando o preço for atingido.

- Criar tabela `alerts` no Supabase
- Interface para criação e gerenciamento de alertas
- Integração com **Supabase Edge Functions** para disparar o e-mail automaticamente

---

### 2. 🖥️ API própria com Node.js

Criar um backend próprio para centralizar e controlar as chamadas de dados de mercado, reduzindo dependência de APIs externas diretamente no frontend.

- Servidor com **Node.js + Express** (ou Fastify)
- Endpoints para cotações, dados históricos e fundamentos
- Cache das respostas para evitar excesso de requisições
- Futura base para regras de negócio mais complexas

---

### 3. 📊 Fundamentos Completos

Exibir indicadores fundamentalistas reais na página de detalhe da ação, que hoje aparecem como `"-"`.

- P/VP, ROE, EV/EBITDA, Margem EBITDA, Dívida/EBITDA, Lucro Líquido
- Histórico de dividendos pagos

---

### 4. 🔐 Login Social (OAuth)

Ativar os botões de "Entrar com Google" e "Entrar com Apple" que já existem na interface.

- Configurar provedores OAuth no Supabase
- Implementar `supabase.auth.signInWithOAuth()`

---

### 5. 📱 Responsividade Mobile

Adaptar a interface para funcionar bem em dispositivos móveis, especialmente as tabelas de ações e os gráficos.

---

### 6. 🚢 Deploy

Publicar a aplicação em produção.

-**Frontend** → Vercel ou Netlify

-**Backend (futuro)** → Railway ou Render

-**Banco / Auth** → Supabase (já em cloud)

---

## 👤 Autor

Desenvolvido como projeto de estudo de desenvolvimento web full-stack.
