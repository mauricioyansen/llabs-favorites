import { UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { CreateAccountService } from "./create-account.service";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("accounts")
export class CreateAccountController {
  constructor(private createAccount: CreateAccountService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    await this.createAccount.execute({
      name,
      email,
      password,
    });
  }
}
