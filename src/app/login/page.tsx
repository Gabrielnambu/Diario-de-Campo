import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, provedores, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Entrar" };

export default async function Login() {
  const session = await auth();
  if (session?.user) redirect("/amostras");

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Cada usuário vê apenas as próprias amostras.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {provedores.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum provedor configurado. Defina <code>AUTH_GITHUB_ID</code>/<code>AUTH_GITHUB_SECRET</code> ou{" "}
            <code>AUTH_GOOGLE_ID</code>/<code>AUTH_GOOGLE_SECRET</code> no <code>.env</code>.
          </p>
        )}
        {provedores.map((p) => (
          <form
            key={p.id}
            action={async () => {
              "use server";
              await signIn(p.id, { redirectTo: "/amostras" });
            }}
          >
            <Button type="submit" variant="outline" className="w-full">
              Continuar com {p.nome}
            </Button>
          </form>
        ))}
      </CardContent>
    </Card>
  );
}
