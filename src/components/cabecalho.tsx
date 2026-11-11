import Link from "next/link";
import { LogOut, Mountain } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export async function Cabecalho() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={user ? "/amostras" : "/"} className="flex items-center gap-2 font-semibold">
          <Mountain className="size-5" /> Diário de Campo
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="size-7">
              {user.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm sm:inline">{user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                <LogOut /> Sair
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
