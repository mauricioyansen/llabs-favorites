import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Card } from "@/components/card";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const createFavoriteListForm = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
});

type CreateFavoriteListForm = z.infer<typeof createFavoriteListForm>;

export function FavoriteList() {
  useAuthRedirect();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateFavoriteListForm>({
    resolver: zodResolver(createFavoriteListForm),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasFavoriteList, setHasFavoriteList] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  useEffect(() => {
    async function fetchFavoriteList() {
      try {
        const response = await api.get("/favorite-list");
        const favoriteList = response.data.userFavList;

        if (favoriteList) {
          setValue("title", favoriteList.title);
          setValue("description", favoriteList.description);
          setIsEditing(true);
          setHasFavoriteList(true);
        } else {
          setHasFavoriteList(false);
        }
      } catch (error) {
        console.error(error);
        setHasFavoriteList(false);
      }
    }

    fetchFavoriteList();
  }, [setValue]);

  async function handleSubmitFavoriteList(data: CreateFavoriteListForm) {
    try {
      if (isEditing && hasFavoriteList) {
        await api.put("/favorite-list", data);
        toast.success("Lista de favoritos atualizada!");
        navigate("/products");
      } else {
        await api.post("/favorite-list", data);
        toast.success("Lista de favoritos criada!");
        navigate("/products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar lista de favoritos.");
    }
  }

  async function handleDeleteFavoriteList() {
    try {
      await api.delete("/favorite-list");
      toast.success("Lista de favoritos deletada!");

      reset();
      setIsEditing(false);
      setHasFavoriteList(false);
      setIsCreatingNew(false);
      clearFavorites();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar lista de favoritos.");
    }
  }

  if (!hasFavoriteList && !isCreatingNew) {
    return (
      <div className="flex flex-col items-center min-h-screen p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Nenhuma lista encontrada</h1>
          <p className="text-muted-foreground text-sm">
            Crie sua primeira lista de favoritos para começar!
          </p>
        </div>
        <Button
          onClick={() => {
            setIsCreatingNew(true);
            reset();
          }}
        >
          Criar Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="flex  min-h-screen p-8 flex-col items-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center relative">
          {isEditing && hasFavoriteList && (
            <button
              onClick={handleDeleteFavoriteList}
              className="absolute right-0 top-0 text-red-500 hover:text-red-700 cursor-pointer"
              title="Deletar lista"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing
              ? hasFavoriteList
                ? "Editar Lista de Favoritos"
                : "Criar Lista de Favoritos"
              : "Criar Lista de Favoritos"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? hasFavoriteList
                ? "Atualize seu título e descrição."
                : "Dê um título e uma descrição para sua nova lista."
              : "Dê um título e uma descrição para sua nova lista."}
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleSubmitFavoriteList)}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ex: Meus produtos favoritos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Ex: Produtos para meu novo apartamento"
            />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Salvando..."
                : "Criando..."
              : isEditing
              ? "Salvar Alterações"
              : "Criar Lista"}
          </Button>
        </form>
      </div>
      {favorites.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Produtos Favoritados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {favorites.map((product) => (
              <Card
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                isFavorited
                variant="remove"
                onFavorite={() => {}}
                onRemoveFavorite={() => removeFavorite(product.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
