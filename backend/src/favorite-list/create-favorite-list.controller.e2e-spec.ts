import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create a favorite list (E2E)", () => {
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

  test("[POST] /favorite-list", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const res = await request(app.getHttpServer())
      .post("/favorite-list")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Test favorite list title",
        description: "Test favorite list description",
      });

    expect(res.statusCode).toBe(201);

    const favListOnDb = await prisma.favoriteList.findFirst({
      where: { title: "Test favorite list title" },
    });

    expect(favListOnDb).toBeTruthy();
  });
});
