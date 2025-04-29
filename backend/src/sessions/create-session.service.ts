import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";

@Injectable()
export class CreateSessionService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async execute({ email, password }) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException("User credentials do not match");

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException("User credentials do not match");

    const accessToken = this.jwt.sign({ sub: user.id });

    return accessToken;
  }
}
