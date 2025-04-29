import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { FavoriteProductService } from "./favorite-product.service";
import { CurrentUser } from "@/auth/current-user-decorator";
import { UserPayload } from "@/auth/jwt.strategy";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("favorite-products")
@UseGuards(JwtAuthGuard)
export class RemoveFavoriteProductController {
  constructor(
    private readonly favoriteProductService: FavoriteProductService,
  ) {}

  @Delete(":id/favorite")
  async removeFavoriteProduct(
    @Param("id") productId: number,
    @CurrentUser() user: UserPayload,
  ): Promise<void> {
    return this.favoriteProductService.removeFavoriteProduct({
      userId: user.sub,
      productId,
    });
  }
}
