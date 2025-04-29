import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const res = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);

    const userOnDb = await prisma.user.findUnique({
      where: { email: "johndoe@example.com" },
    });

    expect(userOnDb).toBeTruthy();
  });
});
