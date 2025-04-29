import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";
import { AxiosHeaders, AxiosResponse } from "axios";
import { CatalogProduct } from "./favorite-product.service";

describe("Remove favorite product (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let httpService: HttpService;
  const mockProductData = generateMockProducts();

  function generateMockProducts(quantity = 5): CatalogProduct[] {
    return Array.from({ length: quantity }, (_, i) => {
      const id = i + 1;
      return {
        id,
        title: `Product ${id}`,
        price: id * 10,
        image: `https://example.com/${id}.jpg`,
      };
    });
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    httpService = moduleRef.get(HttpService);

    vi.spyOn(httpService, "get").mockImplementation((url: string) => {
      const id = Number(url.split("/").pop());
      const product = mockProductData.find((p) => p.id === id);

      const mockSingleResponse: AxiosResponse = {
        data: product,
        status: 200,
        statusText: "OK",
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      return of(mockSingleResponse);
    });

    await app.init();
  });

  test("[DELETE] /favorite-products/:productId/favorite - remove product successfully", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const favList = await prisma.favoriteList.create({
      data: {
        title: "Test fav list title",
        description: "Test fav list description",
        userId: user.id,
      },
    });

    await prisma.favoriteProduct.createMany({
      data: mockProductData.map((product) => ({
        productId: product.id.toString(),
        favoriteListId: favList.id,
      })),
    });

    const productToRemove = mockProductData[0];

    const res = await request(app.getHttpServer())
      .delete(`/favorite-products/${productToRemove.id}/favorite`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);

    const deletedFavorite = await prisma.favoriteProduct.findFirst({
      where: {
        productId: productToRemove.id.toString(),
        favoriteListId: favList.id,
      },
    });

    expect(deletedFavorite).toBeNull();
  });

  test("[DELETE] /favorite-products/:productId/favorite - product not found (404)", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Jane Doe",
        email: "janedoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.favoriteList.create({
      data: {
        title: "Jane's fav list",
        description: "Test fav list description",
        userId: user.id,
      },
    });

    const nonExistentProductId = 9999;

    const res = await request(app.getHttpServer())
      .delete(`/favorite-products/${nonExistentProductId}/favorite`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found in favorites list.");
  });
});
