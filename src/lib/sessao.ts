import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Retorna o id do usuário logado ou redireciona para /login. */
export async function exigirUsuario(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/login");
  return id;
}
