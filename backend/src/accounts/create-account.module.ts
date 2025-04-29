import { Module } from "@nestjs/common";
import { CreateAccountController } from "./create-account.controller";
import { CreateAccountService } from "./create-account.service";
import { PrismaService } from "@/prisma/prisma.service";

@Module({
  imports: [],
  controllers: [CreateAccountController],
  providers: [CreateAccountService, PrismaService],
})
export class CreateAccountModule {}
