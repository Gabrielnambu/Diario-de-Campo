-- O Supabase expõe o schema "public" pela API REST (PostgREST) usando a chave anon.
-- Ligar o RLS sem criar políticas bloqueia esse acesso. O app não é afetado:
-- o Prisma conecta como dono das tabelas, que ignora o RLS.
ALTER TABLE "Amostra" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
