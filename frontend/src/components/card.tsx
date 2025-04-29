import { Button } from "@/components/ui/button";

interface CardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  isFavorited: boolean;
  onFavorite: (productId: number) => void;
  onRemoveFavorite?: () => void;
  variant?: "favorite" | "remove";
}

export function Card({
  id,
  title,
  price,
  image,
  isFavorited,
  onFavorite,
  onRemoveFavorite,
  variant = "favorite",
}: CardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center gap-4 shadow-sm justify-between">
      <h2 className="text-lg font-semibold text-center">{title}</h2>

      <img src={image} alt={title} className="w-32 h-32 object-contain" />

      <p className="text-primary font-bold text-md">R$ {price.toFixed(2)}</p>

      {variant === "favorite" && (
        <Button
          onClick={() => onFavorite(id)}
          disabled={isFavorited}
          className="w-full disabled:cursor-not-allowed"
        >
          {isFavorited ? "Favoritado" : "Favoritar"}
        </Button>
      )}

      {variant === "remove" && (
        <Button
          variant="destructive"
          onClick={onRemoveFavorite}
          className="w-full"
        >
          Remover dos Favoritos
        </Button>
      )}
    </div>
  );
}
