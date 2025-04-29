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

describe("Fetch products (E2E)", () => {
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

    const mockAxiosResponse: AxiosResponse = {
      data: mockProductData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };

    vi.spyOn(httpService, "get").mockImplementation(() =>
      of(mockAxiosResponse),
    );

    await app.init();
  });

  test("[GET] /favorite-products", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const res = await request(app.getHttpServer())
      .get("/favorite-products")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(mockProductData);
  });
});
