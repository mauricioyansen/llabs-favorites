import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { FavoriteListService } from "./favorite-list.service";

@Controller("favorite-list")
@UseGuards(JwtAuthGuard)
export class ShowFavoriteListController {
  constructor(private favoriteListService: FavoriteListService) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const userFavList = await this.favoriteListService.showFavoriteList({
      userId,
    });

    return { userFavList };
  }
}
