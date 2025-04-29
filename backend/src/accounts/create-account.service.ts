import { PrismaService } from "@/prisma/prisma.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { hash } from "bcryptjs";

@Injectable()
export class CreateAccountService {
  constructor(private prisma: PrismaService) {}

  async execute({ name, email, password }) {
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail)
      throw new ConflictException(
        "User with same email address already exists",
      );

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  }
}
