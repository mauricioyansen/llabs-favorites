import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { Body, Controller, Put, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { z } from "zod";
import { FavoriteListService } from "./favorite-list.service";

const editFavoriteListBodySchema = z.object({
  title: z.string(),
  description: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editFavoriteListBodySchema);

type EditFavoriteListBodySchema = z.infer<typeof editFavoriteListBodySchema>;

@Controller("favorite-list")
@UseGuards(JwtAuthGuard)
export class EditFavoriteListController {
  constructor(private favoriteListService: FavoriteListService) {}

  @Put()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditFavoriteListBodySchema,
  ) {
    const userId = user.sub;
    const { title, description } = body;

    const editedUserFavList = await this.favoriteListService.editFavoriteList({
      userId,
      title,
      description,
    });

    return { editedUserFavList };
  }
}
