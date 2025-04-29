import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<Env, true>>(ConfigService);

  const port = configService.get("PORT", { infer: true });

  app.enableCors({
    origin: "http://localhost:5173", // Url padrão do frontend do vite, alterar se necessário
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
