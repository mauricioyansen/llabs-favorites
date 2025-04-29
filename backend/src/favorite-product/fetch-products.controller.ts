import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  CatalogProduct,
  FavoriteProductService,
} from "./favorite-product.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("favorite-products")
@UseGuards(JwtAuthGuard)
export class FetchFavoriteProductsController {
  constructor(
    private readonly favoriteProductService: FavoriteProductService,
  ) {}

  @Get()
  async findAll(): Promise<CatalogProduct[]> {
    return this.favoriteProductService.findAll();
  }
}
