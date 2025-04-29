import { Module } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateSessionService } from "./create-session.service";
import { CreateSessionController } from "./create-session.controller";
import { AuthModule } from "@/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [CreateSessionController],
  providers: [CreateSessionService, PrismaService],
})
export class CreateSessionModule {}
