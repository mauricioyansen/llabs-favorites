import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Delete a favorite list (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[DELETE] /favorite-list", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.favoriteList.create({
      data: {
        title: "Test fav list title",
        description: "Test fav list description",
        userId: user.id,
      },
    });

    const res = await request(app.getHttpServer())
      .delete("/favorite-list")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);

    const favListOnDb = await prisma.favoriteList.findFirst({
      where: { title: "Test fav list title" },
    });

    expect(favListOnDb).toBeNull();
  });
});
