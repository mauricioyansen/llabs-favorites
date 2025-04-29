import { CurrentUser } from "@/auth/current-user-decorator";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { UserPayload } from "@/auth/jwt.strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { FavoriteListService } from "@/favorite-list/favorite-list.service";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { z } from "zod";

const favoriteListBodySchema = z.object({
  title: z.string(),
  description: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(favoriteListBodySchema);

type FavoriteListBodySchema = z.infer<typeof favoriteListBodySchema>;

@Controller("favorite-list")
@UseGuards(JwtAuthGuard)
export class CreateFavoriteListController {
  constructor(private favoriteListService: FavoriteListService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: FavoriteListBodySchema,
  ) {
    const { title, description } = body;
    const userId = user.sub;

    await this.favoriteListService.createFavoriteList({
      userId,
      title,
      description,
    });
  }
}
