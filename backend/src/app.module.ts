import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { loadEnv } from "./env";
import { AuthModule } from "./auth/auth.module";
import { CreateAccountModule } from "./accounts/create-account.module";
import { CreateSessionModule } from "./sessions/create-session.module";
import { FavoriteProductModule } from "./favorite-product/favorite-product.module";
import { FavoriteListModule } from "./favorite-list/favorite-list.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from "./mail/mail.service";
import { QueueModule } from "./queue/queue.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadEnv],
    }),
    MailerModule.forRootAsync({
      useFactory: async () => {
        const env = loadEnv();
        return {
          transport: {
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            auth: {
              user: env.MAILTRAP_USER,
              pass: env.MAILTRAP_PASSWORD,
            },
          },
          defaults: {
            from: '"L Labs Favorites" <no-reply@llabs.com>',
          },
        };
      },
    }),
    AuthModule,
    CreateAccountModule,
    CreateSessionModule,
    FavoriteListModule,
    FavoriteProductModule,
    QueueModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class AppModule {}
