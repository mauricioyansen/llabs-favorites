import { Controller, Delete, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";

import { FavoriteListService } from "./favorite-list.service";

@Controller("favorite-list")
@UseGuards(JwtAuthGuard)
export class DeleteFavoriteListController {
  constructor(private favoriteListService: FavoriteListService) {}

  @Delete()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    await this.favoriteListService.deleteFavoriteList({
      userId,
    });
  }
}
