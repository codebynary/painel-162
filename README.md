<div align="center">

![Painel Perfect World Banner](assets/images/banner.png)

# 🌌 Painel Perfect World v1.6.2
### A Modern, Robust, and Secure Management Suite for PW Servers

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

![Standard](https://img.shields.io/badge/standard-pending_compliance-yellow?style=for-the-badge)

> [!WARNING]
> **Aguardando Padronização Antigravity**: Este projeto deve ser migrado para arquitetura "Docker Dev / Native Prod".
> Consulte: `.agent/PROJECT_STATUS.md` e a tarefa associada.

---

**Painel PW 162** é uma solução completa de ecossistema para servidores de Perfect World, focada em segurança, performance e experiência do usuário (UX). Desenvolvido com as tecnologias mais modernas do mercado, o painel oferece uma interface intuitiva tanto para jogadores quanto para administradores, sem comprometer a integridade dos dados originais do jogo.

[Explorar Features](#-principais-recursos) • [Arquitetura](#-arquitetura-do-projeto) • [Guia de Instalação](#-guia-de-instalação-quickstart) • [Stack](#-stack-tecnológica)

</div>

## 🎯 Objetivo do Projeto

O objetivo central é fornecer um **Painel Web moderno (User + ADM)** totalmente integrado ao core do **Perfect World 162**, respeitando a separação rigorosa entre camadas:
- **Camada de Dados**: MySQL isolado para contas, painel e sistema de doação.
- **Camada de Jogo**: Integração via `gdeliveryd` e leitura controlada de bancos PW.
- **Segurança**: Zero edição direta de BLOBs perigosos e escrita controlada para evitar corrupção de personagens.

---

## 🧱 Visão Geral da Arquitetura

```mermaid
graph TD
    User([Usuário / Jogador]) -->|React UI| Frontend[Frontend - React/Vite]
    Frontend -->|JWT Auth| Backend[Backend API - Node.js/TS]
    Backend -->|Prepared Statements| MySQL[(MySQL - DB Painel/Contas)]
    Backend -.->|Delivery via Core PW| Gdeliveryd[gdeliveryd / GS / Auth]

    subgraph "Camada de Dados PW"
    MySQL
    end

    subgraph "Servidor Perfect World"
    Gdeliveryd
    end

    style Frontend fill:#3b82f6,stroke:#1e3a8a,color:#fff
    style Backend fill:#10b981,stroke:#064e3b,color:#fff
    style MySQL fill:#f59e0b,stroke:#78350f,color:#fff
    style Gdeliveryd fill:#ef4444,stroke:#7f1d1d,color:#fff
```

---

## ✨ Principais Recursos

### 👤 Área do Jogador
- **Dashboard Dinâmico**: Visão geral da conta, quantidade de personagens e saldo de Gold/Cash.
- **Gestão de Personagens**: Lista detalhada com level, classe, status e visualização de inventário (read-only).
- **Sistema de Doações**: Histórico de compras, gestão de pacotes e entrega automática.
- **Segurança da Conta**: Alteração de senha e logs de atividade.

### 🛡️ Portal Administrativo (ADM)
- **Gestão de Contas**: Banimento, desbanimento, reset de senhas e monitoramento de IPs.
- **Gestão de Personagens**: Ferramentas de suporte (Kick, Rename, Transferência).
- **Controle do Servidor**: Status em tempo real (Auth, GS, Delivery) e Broadcast global.
- **Logs Completos**: Auditoria de cada ação realizada no painel.

---

## 🧰 Stack Tecnológica

### 🔹 Backend (API Engine)
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js com TypeScript
- **Auth**: JWT (Access + Refresh Tokens) & bcrypt para hashing
- **Segurança**: Helmet.js, Rate Limiting e Zod para validação
- **Log**: Winston Logging System
- **Database**: Driver `mysql2` robusto

### 🔹 Frontend (User Interface)
- **Core**: React 18/19 & Vite
- **Estilização**: Tailwind CSS (Modern Dark UI)
- **Animações**: Framer Motion (Transições fluidas)
- **Ícones**: Lucide React & HeroIcons
- **Gerenciamento de Estado**: React Hooks nativos

### 🔹 Infraestrutura
- **Deployment**: Docker & Docker Compose
- **Orquestração**: PM2 para processos em Node.js
- **Proxy**: Nginx para balanceamento e segurança

---

## 📁 Estrutura de Pastas

```bash
painel-162/
├── backend/            # API Core, Lógica de Negócios e Conexão DB
├── frontend/           # Interface do Usuário (Single Page Application)
├── scripts/            # Scripts Shell para automação e integração PW
├── docker-compose.yml  # Definição dos containers (Dev/Prod)
└── README.md           # Você está aqui!
```

---

## 🚀 Guia de Instalação Quickstart

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/code-bynary/painel-162.git
cd painel-162

# Instalar Backend
cd backend && npm install && cd ..

# Instalar Frontend
cd frontend && npm install && cd ..
```

### 2. Subir Infraestrutura (Docker)
```bash
docker-compose up -d --build
```

### 3. Configurar Variáveis de Ambiente
Renomeie `.env.example` para `.env` tanto no `frontend` quanto no `backend` e configure as chaves secretas.

### 4. Modo Desenvolvimento
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## ⚠️ Regras de Ouro (Segurança PW)
1. **Nunca editar BLOBs manualmente**: Manipulação direta pode corromper a database r_roles.
2. **Escrita Indireta**: O painel utiliza o sistema de delivery nativo para evitar conflitos de salvamento do jogo.
3. **Auditoria**: Toda ação administrativa gera um rastro imutável de logs.

---

<div align="center">

Desenvolvido com ❤️ pela comunidade **Antigravity**
_Transformando a gestão de Perfect World para a nova era._

</div>
