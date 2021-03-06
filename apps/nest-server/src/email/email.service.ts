import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, NotFoundException } from "@nestjs/common";
import Mail from "nodemailer/lib/mailer";
import { AuthService } from "src/auth/auth.service";
import { Repository } from "typeorm";

@Injectable()
export class EmailService {
  private transporter: Mail; // 이메일을 전송하기 위한 노드 메일러 사용
  constructor(private readonly mailerService: MailerService) {}

  async _send(tos: string[], subject: string, templateName: string, context: any = {}): Promise<boolean> {
    await this.mailerService.sendMail({
      to: tos.join(", "),
      subject,
      template: `${templateName}`,
      context,
    });

    return true;
  }

  // 가입 요청 확인용 이메일 전송
  async sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string) {
    const baseUrl = "http://localhost:4949"; // TODO: config
    const url = `${baseUrl}/auth/email-verify?signupVerifyToken=${signupVerifyToken}`;

    await this._send([emailAddress], "[nest] 가입 확인 메일", "signin.ejs", {
      email: emailAddress,
      datetime: new Date(),
      url: url,
    });
  }
}
