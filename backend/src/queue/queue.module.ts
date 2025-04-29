import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { FavoriteProductProcessor } from "./favorite-product.processor";
import { FavoriteProductModule } from "@/favorite-product/favorite-product.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "favorite-product",
      connection: {
        host: "localhost",
        port: 6379,
      },
    }),
    FavoriteProductModule,
  ],
  providers: [FavoriteProductProcessor],
})
export class QueueModule {}
