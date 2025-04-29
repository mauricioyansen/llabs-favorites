import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card } from "@/components/card";
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export function Products() {
  useAuthRedirect();

  const [products, setProducts] = useState<Product[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listExists, setListExists] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/favorite-list");
        setListExists(true);
      } catch (err: any) {
        if (err.response?.status === 400) {
          setListExists(false);
        } else {
          toast.error("Erro ao verificar a lista de favoritos.");
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/favorite-products");
        setProducts(response.data);

        const favoritesResponse = await api.get("/favorite-products/favorites");
        const favoriteIds = favoritesResponse.data.map(
          (product: Product) => product.id
        );
        setFavoritedIds(favoriteIds);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar produtos.");
      } finally {
        setIsLoading(false);
      }
    }

    if (listExists) fetchProducts();
  }, [listExists]);

  async function handleFavorite(productId: number) {
    if (favoritedIds.length >= 5) {
      toast.error("Sua lista pode conter até 5 produtos favoritados!");
      return;
    }

    try {
      await api.post(`/favorite-products/${productId}/favorite`);
      setFavoritedIds((prev) => [...prev, productId]);
      toast.success("Produto favoritado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao favoritar produto.");
    }
  }

  if (listExists === false) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-xl font-semibold mb-4">
          Você precisa primeiro criar uma lista para visualizar os produtos.
        </h1>
        <Button onClick={() => navigate("/")}>Criar lista de favoritos</Button>
      </div>
    );
  }

  if (isLoading || listExists === null) {
    return (
      <div className="p-8 text-2xl font-bold mb-8 text-center">
        Carregando produtos...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Produtos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            isFavorited={favoritedIds.includes(product.id)}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
