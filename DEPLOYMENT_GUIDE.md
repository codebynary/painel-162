# Deployment & Integration Guide (Home PC / Production)

This guide is designed for the agent or developer setting up the **Painel 162** project in a new environment (e.g., Home PC with full infrastructure).

## Project Overview
- **Backend**: Node.js, Express, MySQL (mocked via Docker), JWT.
- **Frontend**: React, Vite, TailwindCSS, Framer Motion.
- **Database**: MySQL 5.7 (Dockerized).

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

## Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/code-bynary/painel-162.git
cd painel-162

# Install Backend Dependencies
cd backend
npm install
cd ..

# Install Frontend Dependencies
cd frontend
npm install
cd ..
```

### 2. Database Setup (Docker)
The project uses a localized MySQL container.
```bash
# In the project root
docker-compose up -d --build
```
*Note: This utilizes `scripts/init.sql` to create `pw_auth`, `pw_users`, and mock tables (`characters`, `donate_packages`).*

### 3. Environment Variables
Ensure `backend/.env` is configured (it should be committed or created based on `.env.example`).
```env
PORT=3000
DB_HOST=mysql
DB_USER=root
DB_PASS=root
DB_NAME_AUTH=pw_auth
DB_NAME_USERS=pw_users
JWT_SECRET=supersecret
```

### 4. Running the Application
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Production / Real Infrastructure Integration

Para converter o ambiente **Mock** para um servidor **Perfect World Real**:

### 1. Database Connection
O painel utiliza o **Repository Pattern**. Você só precisa atualizar o arquivo `backend/.env` com as credenciais reais.
- O `CharacterRepository.ts` está preparado para ler as tabelas PW nativas ou ser adaptado na camada de Repository.

### 2. Integração com RPC (GProvider/GDelivery)
As ações em jogo (como teleporte ou entrega de Gold) devem utilizar a pasta `backend/src/rpc`.
- **Teleporte**: Já configurado para chamar o `CharacterService`, pronto para o sender RPC.
- **Broadcast**: O `AdminController` possui a estrutura para enviar sinais ao `GProvider`.

### 3. Sistema de Gold (`DonateService.ts`)
A lógica de entrega foi centralizada no `DonateService`.
- Para **Entrega Automática**: No método `confirmPayment`, ative a chamada SQL para a tabela `cash` ou o sinal RPC.
- **Gateway**: Basta injetar o SDK do MercadoPago ou Stripe no `DonateService`.

### 4. Gestão de Processos (`ServerService.ts`)
O serviço de controle de servidor é extensível para Linux ou Windows.
- **Comandos Local/SSH**: Edite o `ServerService` para executar comandos de sistema via `child_process.exec`.

## Troubleshooting
- **Docker**: If ports 3306 are occupied, change `docker-compose.yml`.
- **CORS**: Check `backend/src/server.ts` if frontend cannot talk to backend on different IPs.
