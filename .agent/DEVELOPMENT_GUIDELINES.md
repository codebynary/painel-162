# Diretrizes de Desenvolvimento e Arquitetura - Painel 162

Este documento estabelece as regras de ouro para o desenvolvimento deste projeto, garantindo que ele sirva como um modelo premium para futuros desenvolvedores e agentes de IA.

## 📝 Regras de Ouro (Core Rules)

1. **Consulta Obrigatória**: Antes de qualquer ação, consulte a pasta `e:\Projetos Antigravity\perfect-world\documentacao` para entender a lógica RPC (Marshallizing) do Perfect World. Aquela pasta é **APENAS PARA CONSULTA**.
2. **Registro de Commits**: Cada mudança significativa deve ser documentada. Explique o "porquê" e não apenas o "o quê".
3. **Qualidade Premium**: O código deve ser limpo, tipado (TypeScript) e seguir padrões modernos de UX/UI (Glassmorphism, Dark UI).
4. **Sem Docker/WSL**: No ambiente atual, **não utilize Docker ou WSL**. O projeto deve rodar de forma nativa via `npm run dev`.

## 🏗️ Padrões de Código

- **Backend (Node.js/TS)**: Use arquitetura modular por domínios (`auth`, `characters`, `admin`).
- **Frontend (React 19)**: Use Tailwind CSS 4, Framer Motion para animações e Lucide para ícones.
- **Segurança**: Nunca edite BLOBs do PW diretamente via SQL se houver um Opcode disponível no projeto de referência.

## 📚 Documentação de Commits e Evolução

Cada etapa do projeto deve ser registrada no `task.md` localizado no diretório de dados do agente. Manter o histórico de progresso é vital.

---
*Assinado: Antigravity Agent*
