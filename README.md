# Diário de Campo

Catálogo de amostras de campo (rocha, solo, água, sedimento) com local no mapa, data, foto e observações.
Cada usuário vê apenas as próprias amostras.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind + shadcn/ui · PostgreSQL (Supabase) + Prisma 7 · Auth.js (NextAuth v5) · Zod · React-Leaflet + OpenStreetMap · UploadThing

## Rodando localmente

```bash
npm install
cp .env.example .env      # e preencha (veja abaixo)
npm run db:deploy         # cria as tabelas no banco
npm run dev
```

### Banco: Supabase

1. Crie um projeto em <https://supabase.com> (anote a senha do banco).
2. No projeto, clique em **Connect** → aba **ORMs** → **Prisma** e copie as duas URLs para o `.env`:
   - `DATABASE_URL` — pooler em modo transação (porta **6543**, com `?pgbouncer=true`): usada pelo app.
   - `DIRECT_URL` — pooler em modo sessão (porta **5432**): usada pelas migrations (`prisma.config.ts`).
3. `npm run db:deploy`.

A migration `habilitar_rls` liga o Row Level Security em todas as tabelas. Isso bloqueia o acesso pela
API REST do Supabase (chave `anon`), que de outro modo exporia sessões e tokens. O app não é afetado,
porque o Prisma conecta como dono das tabelas. A separação entre usuários é feita no código
(`src/lib/amostras.ts` e `actions.ts` sempre filtram por `userId`).

> Alternativa offline: `npx prisma dev -d -n diario-de-campo` sobe um Postgres local e imprime a
> `DATABASE_URL` (nesse caso, deixe `DIRECT_URL` vazia).

### Login (pelo menos um provedor)

- **GitHub:** <https://github.com/settings/developers> → *New OAuth App*
  Callback: `http://localhost:3000/api/auth/callback/github` → `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
- **Google:** Google Cloud Console → *Credentials* → *OAuth client ID* (Web)
  Redirect URI: `http://localhost:3000/api/auth/callback/google` → `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`

Só aparecem na tela de login os provedores com credenciais no `.env`.

### Fotos (opcional)

Crie um app em <https://uploadthing.com> e copie o token para `UPLOADTHING_TOKEN`. Sem ele, o formulário funciona sem o campo de foto.

## Estrutura

```
prisma/schema.prisma          Modelos: Amostra + tabelas do Auth.js
src/auth.ts                   Configuração do Auth.js (provedores, adapter Prisma)
src/lib/validacao.ts          Schemas Zod (amostra e filtros)
src/lib/amostras.ts           Consultas — sempre filtradas por userId
src/app/amostras/actions.ts   Server Actions: criar, editar, excluir
src/app/amostras/             Lista/mapa + filtros, nova, detalhe, editar
src/components/mapa-leaflet   Mapa (pontos coloridos por tipo; clique para escolher local)
src/app/api/uploadthing/      Endpoint de upload (exige login)
```

## Deploy na Vercel

1. Suba o projeto para o GitHub e importe na Vercel.
2. Na Vercel, defina as variáveis: `DATABASE_URL` (a do pooler, porta 6543), `AUTH_SECRET`, credenciais OAuth e `UPLOADTHING_TOKEN`.
   `DIRECT_URL` não é necessária na Vercel: as migrations rodam da sua máquina.
3. Sempre que houver migration nova: `npm run db:deploy` localmente, com o `.env` apontando para o Supabase.
4. Nos apps OAuth, adicione o callback de produção: `https://SEU-APP.vercel.app/api/auth/callback/github` (e/ou `google`).
