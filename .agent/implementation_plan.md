# Plano de Implementação: Painel Web "Next-Gen" para Perfect World

Este plano detalha como transformar o projeto atual (`BWPlay-API`) em um painel completo para jogadores e administradores, seguindo o padrão visual e funcional dos painéis da **New History** e **Central History**.

## 🛠️ Nova Arquitetura Proposta

Para atingir o objetivo e garantir a **Expansão Futura**, utilizaremos uma arquitetura desacoplada e baseada em padrões:
1.  **Backend (API)**: Node.js + TS seguindo **Repository Pattern** e **Provider Pattern** para o RPC. Isso permite que novas versões de PW sejam adicionadas apenas criando um novo "Provider".
2.  **Frontend (UI)**: React 19 com **Atomic Design** simplificado e **Zustand** para gestão de estado global, facilitando a adição de novos módulos por outros devs.

---

## 📅 Fases do Projeto

### Fase 1: Interface e Autenticação (Skin & Identity)
- **Design**: Criar um layout Dark/Red com Glassmorphism (efeito vidro).
- **Módulos**:
    - Tela de Login e Registro (integrada ao banco `auth` do PW).
    - Recuperação de Senha por E-mail.
- **Diferencial**: Dashboard inicial com status do servidor (Online/Offline) e contagem de jogadores (usando `/game/onlines`).

### Fase 2: Gestão de Personagens (O "Coração")
- **Visualização**: Listagem de todos os personagens da conta com ícones de classe e nível.
- **Funcionalidades**:
    - **Teleporte**: Resetar coordenadas (X: 128, Y: 200, Z: 128) caso o char esteja preso.
    - **Reset de Senha**: Limpar `storehousepasswd` (já existe na API).
    - **Edição de Status**: Permitir ao ADM alterar nível/cultivo via interface.

### Fase 3: Módulo de Gestão do Servidor (Control Room)
Esta é a parte que falta no projeto atual e será adicionada:
- **Ligar/Desligar**: Implementar rotas que executam scripts `.sh` via SSH ou comandos locais bloqueados por permissão de root.
- **Gestão de Mapas**: Interface para habilitar/desabilitar IDs de mapas específicos (instâncias).
- **Logs**: Visualização em tempo real das últimas linhas do `world_log`.

### Fase 4: Economia e Suporte (Tickets & Billing)
- **Inclusão de Gold**:
    - Rotinas de inserção direta na tabela `cash` do banco de dados Billing.
    - Sistema de Cupom (Código Premiado).
- **Chamados (Tickets)**:
    - Interface para o jogador abrir tickets de suporte.
    - Dashboard de ADM para responder e fechar tickets.

---

## 🔒 Segurança e Verificação

### Plano de Verificação Automática
- **Testes de Rota**: Criar testes `phpunit` para garantir que o `Marshallizer` não quebre ao lidar com novas versões de PW.
- **Staging**: Deploy em um ambiente de teste espelhado para validar comandos de ligar/desligar sem afetar o servidor principal.

### Verificação Manual
1.  **Fluxo de Registro**: Testar se o novo usuário criado no site consegue logar no jogo.
2.  **Injeção de Gold**: Validar se o crédito aparece na loja (gshop) sem precisar deslogar (se o biling estiver configurado corretamente).
3.  **Responsividade**: Testar o painel no celular e tablet (essencial para jogadores verem o status do servidor fora de casa).

---

## 🚀 Próximos Passos
> [!IMPORTANT]
> Para começar, precisamos decidir se manteremos o backend no mesmo repositório ou se criaremos um novo projeto para o Frontend. Recomendo criar um diretório `/web` dentro do projeto atual para manter a integração fácil.

Você deseja que eu comece criando o **boilerplate do Frontend** com o estilo Visual do New History?
