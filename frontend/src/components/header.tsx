import { Boxes, ShoppingBag, Star } from "lucide-react";
import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <ShoppingBag className="size-6" />

        <Separator className="h-6" orientation="vertical" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to={"/"}>
            <Star className="size-4" />
            Lista de favoritos
          </NavLink>

          <NavLink to={"/products"}>
            <Boxes className="size-4" />
            Todos os produtos
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
