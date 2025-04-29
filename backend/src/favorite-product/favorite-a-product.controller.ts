import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { FavoriteProductService } from "./favorite-product.service";
import { CurrentUser } from "@/auth/current-user-decorator";
import { UserPayload } from "@/auth/jwt.strategy";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("favorite-products")
@UseGuards(JwtAuthGuard)
export class FavoriteAProductController {
  constructor(
    private readonly favoriteProductService: FavoriteProductService,
  ) {}

  @Post(":id/favorite")
  async favoriteProduct(
    @Param("id") productId: number,
    @CurrentUser() user: UserPayload,
  ): Promise<{ message: string }> {
    return this.favoriteProductService.favoriteProduct({
      userId: user.sub,
      productId,
    });
  }
}
