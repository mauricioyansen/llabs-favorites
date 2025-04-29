import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  async function loadFavorites() {
    try {
      const response = await api.get<Product[]>("/favorite-products/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Erro ao carregar favoritos", error);
    }
  }

  async function addFavorite(product: Product) {
    try {
      await api.post(`/favorite-products/${product.id}/favorite`);
      setFavorites((prev) => [...prev, product]);
    } catch (error) {
      console.error("Erro ao favoritar produto", error);
    }
  }

  async function removeFavorite(productId: number) {
    try {
      await api.delete(`/favorite-products/${productId}/favorite`);
      setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
    } catch (error) {
      console.error("Erro ao remover favorito", error);
    }
  }

  function clearFavorites() {
    setFavorites([]);
  }

  const isFavorite = (productId: number) => {
    return favorites.some((fav) => fav.id === productId);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    favoritesCount: favorites.length,
  };
}
