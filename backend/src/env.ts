import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string().url(),
  PRIVATE_KEY_PATH: z.string(),
  PUBLIC_KEY_PATH: z.string(),
  MAILTRAP_USER: z.string(),
  MAILTRAP_PASSWORD: z.string(),
  FAKE_API_PRODUCTS_URL: z.string(),
});

export const loadEnv = () => {
  const parsed = envSchema.parse(process.env);

  return {
    ...parsed,
    JWT_PRIVATE_KEY: fs.readFileSync(
      path.resolve(parsed.PRIVATE_KEY_PATH),
      "utf-8",
    ),
    JWT_PUBLIC_KEY: fs.readFileSync(
      path.resolve(parsed.PUBLIC_KEY_PATH),
      "utf-8",
    ),
  };
};

export type Env = ReturnType<typeof loadEnv>;
