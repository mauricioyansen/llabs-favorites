import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendFavoriteProductNotification(to: string, productTitle: string) {
    await this.mailerService.sendMail({
      to,
      subject: "Produto favoritado com sucesso!",
      text: `Você adicionou o produto "${productTitle}" à sua lista de favoritos.`,
      html: `<p>Você adicionou o produto <strong>${productTitle}</strong> à sua lista de favoritos.</p>`,
    });
  }
}
