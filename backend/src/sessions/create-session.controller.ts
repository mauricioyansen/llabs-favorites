import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { CreateSessionService } from "./create-session.service";

const createSessionBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type CreateSessionBodySchema = z.infer<typeof createSessionBodySchema>;

@Controller("sessions")
export class CreateSessionController {
  constructor(private createSession: CreateSessionService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSessionBodySchema))
  async handle(@Body() body: CreateSessionBodySchema) {
    const { email, password } = body;

    const accessToken = await this.createSession.execute({ email, password });

    return { accessToken };
  }
}
