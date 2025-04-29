import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme/theme-provider";

export function App() {
  return (
    <>
      <ThemeProvider storageKey="fav-products-theme" defaultTheme="system">
        <Toaster richColors />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}
