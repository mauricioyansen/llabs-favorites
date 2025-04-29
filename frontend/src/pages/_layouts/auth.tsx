import { Outlet } from "react-router";
import { ShoppingBag } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="h-full border-r border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <ShoppingBag className="size-5" />
          <span className="font-semibold">
            L Labs - Favorite seu produto
          </span>
        </div>
        <footer className="text-sm">
          Painel do usuário - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center relative">
        <Outlet />
      </div>
    </div>
  );
}
