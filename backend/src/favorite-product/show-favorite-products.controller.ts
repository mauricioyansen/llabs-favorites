import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  CatalogProduct,
  FavoriteProductService,
} from "./favorite-product.service";
import { CurrentUser } from "@/auth/current-user-decorator";
import { UserPayload } from "@/auth/jwt.strategy";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("favorite-products")
@UseGuards(JwtAuthGuard)
export class ShowUserFavoriteProductsController {
  constructor(
    private readonly favoriteProductService: FavoriteProductService,
  ) {}

  @Get("favorites")
  async getFavorites(
    @CurrentUser() user: UserPayload,
  ): Promise<CatalogProduct[]> {
    return this.favoriteProductService.getFavorites({ userId: user.sub });
  }
}
