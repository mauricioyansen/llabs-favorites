import { Module } from "@nestjs/common";
import { FavoriteProductService } from "./favorite-product.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaService } from "@/prisma/prisma.service";
import { AuthModule } from "@/auth/auth.module";
import { FetchFavoriteProductsController } from "./fetch-products.controller";
import { FavoriteAProductController } from "./favorite-a-product.controller";
import { ShowUserFavoriteProductsController } from "./show-favorite-products.controller";
import { RemoveFavoriteProductController } from "./remove-favorite-product.controller";
import { MailService } from "@/mail/mail.service";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    HttpModule,
    AuthModule,
    BullModule.registerQueue({
      name: "favorite-product",
    }),
  ],
  controllers: [
    FetchFavoriteProductsController,
    FavoriteAProductController,
    ShowUserFavoriteProductsController,
    RemoveFavoriteProductController,
  ],
  providers: [FavoriteProductService, PrismaService, MailService],
  exports: [FavoriteProductService],
})
export class FavoriteProductModule {}
