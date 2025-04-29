import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CatalogProduct } from "./favorite-product.service";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";
import { AxiosHeaders, AxiosResponse } from "axios";

describe("Show favorite products (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let httpService: HttpService;
  const mockProductData = generateMockProducts();

  function generateMockProducts(quantity = 10): CatalogProduct[] {
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

  test("[GET] /favorite-products/favorites", async () => {
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
      data: mockProductData.slice(0, 5).map((product) => ({
        productId: product.id.toString(),
        favoriteListId: favList.id,
      })),
    });

    const res = await request(app.getHttpServer())
      .get(`/favorite-products/favorites`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(5);

    for (let i = 0; i < 5; i++) {
      expect(res.body[i]).toMatchObject({
        id: mockProductData[i].id,
        title: mockProductData[i].title,
        price: mockProductData[i].price,
        image: mockProductData[i].image,
      });
    }
  });
});
