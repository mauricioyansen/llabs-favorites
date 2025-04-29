import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in");
      toast.error("Sessão encerrada");
      return;
    }
  }, [navigate]);
}
