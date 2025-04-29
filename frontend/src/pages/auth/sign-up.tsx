import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const signUpForm = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Senha deve conter ao menos 6 dígitos" }),
});

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>();

  async function handleSignUp(data: SignUpForm) {
    try {
      await api.post("/accounts", data);
      toast.success("Usuário criado com sucesso!");
      navigate("/sign-in");
    } catch (error: any) {
      console.error(error);

      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;

        if (errors?.details && Array.isArray(errors.details)) {
          const friendlyMessages = errors.details.map((err: any) => {
            if (err.path.includes("email")) {
              return "Informe um email válido.";
            }
            if (err.path.includes("password")) {
              return "A senha precisa ter pelo menos 6 caracteres.";
            }
            return err.message;
          });

          friendlyMessages.forEach((msg: string) => {
            toast.error(msg);
          });
        } else {
          toast.error(message || "Erro ao criar usuário.");
        }
      } else {
        toast.error("Erro de conexão com o servidor.");
      }
    }
  }

  return (
    <div className="p-8">
      <Button asChild className="absolute right-8 top-8" variant={"secondary"}>
        <Link to={"/sign-in"}>Fazer login</Link>
      </Button>
      <div className="w-[350px] flex flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center ">
          <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p className="text-sm text-muted-foreground">
            Crie uma conta e escolha seus produtos favoritos!
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" type="text" {...register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register("password")} />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            Finalizar cadastro
          </Button>
        </form>
      </div>
    </div>
  );
}
