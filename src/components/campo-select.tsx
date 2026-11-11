import { cn } from "@/lib/utils";

/** <select> nativo com o visual dos inputs do shadcn (funciona em forms GET sem JS). */
export function CampoSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}
