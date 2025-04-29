import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

interface FavoriteListServiceRequest {
  userId: string;
  title: string;
  description: string;
}

@Injectable()
export class FavoriteListService {
  constructor(private prisma: PrismaService) {}

  async createFavoriteList({
    userId,
    title,
    description,
  }: FavoriteListServiceRequest) {
    const userHasList = await this.prisma.favoriteList.findFirst({
      where: { userId },
    });

    if (userHasList)
      throw new BadRequestException("User can only have one favorite list");

    await this.prisma.favoriteList.create({
      data: { title, description, userId },
    });
  }

  async showFavoriteList({ userId }) {
    const userFavList = await this.prisma.favoriteList.findUnique({
      where: { userId },
    });

    if (!userFavList)
      throw new BadRequestException(
        "This user do not have any favorite list registered",
      );

    return userFavList;
  }

  async editFavoriteList({
    userId,
    title,
    description,
  }: FavoriteListServiceRequest) {
    const userFavList = await this.prisma.favoriteList.findFirst({
      where: { userId },
    });

    if (!userFavList)
      throw new BadRequestException(
        "This user do not have any favorite list registered",
      );

    const favListEdited = await this.prisma.favoriteList.update({
      where: { id: userFavList.id },
      data: { title, description },
    });

    return favListEdited;
  }

  async deleteFavoriteList({ userId }) {
    const userFavList = await this.prisma.favoriteList.findFirst({
      where: { userId },
    });

    if (!userFavList)
      throw new BadRequestException(
        "This user do not have any favorite list registered",
      );

    await this.prisma.favoriteProduct.deleteMany({
      where: { favoriteListId: userFavList.id },
    });

    await this.prisma.favoriteList.delete({
      where: { id: userFavList.id },
    });
  }
}
