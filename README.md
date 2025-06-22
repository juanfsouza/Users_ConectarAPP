## Users Manager - Conéctar

## Introdução

Uma ferramenta interna para gerenciar usuários da Conéctar, com foco em segurança e escalabilidade.

## Pré-requisitos

- Node.js 18+
- Next.js
- Variáveis de ambiente em .env

## Instalação

- Clone o repositório: git clone https://github.com/juanfsouza/Users_ConectarAPP
- Instale as dependências: cd Users_ConectarAPP && npm install
- Configure o .env com as variáveis necessárias.
- Crie o banco de dados e migre o schema (ex.: npx typeorm migration:run).

## Execução

- Backend: npm run start:dev
- Frontend: npm run dev

## Estrutura do Projeto

- components: Componentes React (ex.: ClientWrapper.tsx, UsersTable.tsx)
- contexts: Contextos (ex.: AuthContext.tsx)
- dashboard: Páginas do dashboard (ex.: page.tsx, profile/page.tsx)
- pages: Páginas principais (ex.: register/page.tsx)
- users/[id]/edit: Edição de usuários
- hooks: Hooks personalizados (ex.: useAuth.tsx)
- lib: Bibliotecas (ex.: api.ts, tokenManager.ts)
- types: Tipos TypeScript

## Funcionalidades

- CRUD de usuários com permissões (admin/user).
- Filtros e ordenação.
- Notificações de usuários inativos.
- Logout funcional.
- Login Google
- Testes

## Deploy

- Frontend Vercel: https://users-manager-frontend.vercel.app/
- Backend Render: https://users-conectar.onrender.com

Obs: O backend pode não estar funcionando devido às regras do Render; se precisar testar, envie uma mensagem no WhatsApp para reiniciar.
