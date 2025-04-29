import { Module } from "@nestjs/common";
import { CreateFavoriteListController } from "./create-favorite-list.controller";
import { ShowFavoriteListController } from "./show-favorite-list.controller";
import { EditFavoriteListController } from "./edit-favorite-list.controller";
import { DeleteFavoriteListController } from "./delete-favorite-list.controller";
import { FavoriteListService } from "./favorite-list.service";
import { PrismaService } from "@/prisma/prisma.service";

@Module({
  controllers: [
    CreateFavoriteListController,
    ShowFavoriteListController,
    EditFavoriteListController,
    DeleteFavoriteListController,
  ],
  providers: [FavoriteListService, PrismaService],
})
export class FavoriteListModule {}
