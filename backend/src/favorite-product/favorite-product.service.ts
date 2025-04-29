import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { PrismaService } from "@/prisma/prisma.service";
import { MailService } from "@/mail/mail.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Env, envSchema } from "@/env";
import { ConfigService } from "@nestjs/config";

export interface CatalogProduct {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class FavoriteProductService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
    private readonly mailService: MailService,
    private config: ConfigService<Env, true>,
    @InjectQueue("favorite-product") private favoriteProductQueue: Queue,
  ) {}
  async findAll(): Promise<CatalogProduct[]> {
    const response: AxiosResponse<CatalogProduct[]> = await firstValueFrom(
      this.httpService.get(this.config.get("FAKE_API_PRODUCTS_URL")),
    );

    return response.data.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    }));
  }

  async favoriteProduct({ productId, userId }): Promise<{ message: string }> {
    await this.favoriteProductQueue.add("favorite-product-job", {
      productId,
      userId,
    });

    return { message: "Favorite request received and will be processed soon." };
  }

  async executeFavoriteProduct({ productId, userId }): Promise<CatalogProduct> {
    const response: AxiosResponse<CatalogProduct> = await firstValueFrom(
      this.httpService.get(
        `${this.config.get("FAKE_API_PRODUCTS_URL")}/${productId}`,
      ),
    );

    const product = response.data;
    if (!product) {
      throw new NotFoundException("Product not found.");
    }

    const favoriteList = await this.prisma.favoriteList.findUnique({
      where: { userId: userId },
      include: {
        favorites: true,
      },
    });

    if (!favoriteList) {
      throw new NotFoundException("Favorite list not found.");
    }

    const productExistsInFavorites = favoriteList.favorites.some(
      (favorite) => favorite.productId === productId,
    );
    if (productExistsInFavorites) {
      throw new BadRequestException("Product already favorited.");
    }

    if (favoriteList.favorites.length >= 5) {
      throw new BadRequestException(
        "It is not possible to favorite more than 5 products.",
      );
    }

    await this.prisma.favoriteProduct.create({
      data: {
        productId: productId,
        favoriteListId: favoriteList.id,
      },
    });

    const favoriteProduct: CatalogProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    };

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    await this.mailService.sendFavoriteProductNotification(
      user.email,
      product.title,
    );

    return favoriteProduct;
  }

  async getFavorites({ userId }): Promise<CatalogProduct[]> {
    const favoriteList = await this.prisma.favoriteList.findUnique({
      where: { userId: userId },
      include: {
        favorites: true,
      },
    });

    if (!favoriteList) {
      throw new NotFoundException("Favorite list not found.");
    }

    const favoriteProducts: CatalogProduct[] = [];
    for (const favorite of favoriteList.favorites) {
      const response: AxiosResponse<CatalogProduct> = await firstValueFrom(
        this.httpService.get(
          `${this.config.get("FAKE_API_PRODUCTS_URL")}/${favorite.productId}`,
        ),
      );
      const product = response.data;

      favoriteProducts.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
    }
    return favoriteProducts;
  }

  async removeFavoriteProduct({ productId, userId }): Promise<void> {
    const favoriteList = await this.prisma.favoriteList.findUnique({
      where: { userId: userId },
      include: {
        favorites: true,
      },
    });

    if (!favoriteList) {
      throw new NotFoundException("Favorite list not found.");
    }

    const favoriteProduct = favoriteList.favorites.find(
      (favorite) => favorite.productId === productId,
    );

    if (!favoriteProduct) {
      throw new NotFoundException("Product not found in favorites list.");
    }

    await this.prisma.favoriteProduct.delete({
      where: { id: favoriteProduct.id },
    });
  }
}
