import { Injectable } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";
import { ConfigService } from "../config/config.service";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import { ResourcesService } from "../resources/resources.service";
import Handlebars from "handlebars";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "../../generated/i18n.generated";
import { OtpUseCase } from "@prisma/client";


@Injectable()
export class MailService {

  readonly transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

  constructor(
    private readonly configService: ConfigService,
    private readonly resourcesService: ResourcesService,
    private readonly i18n: I18nService<I18nTranslations>
  ) {
    this.transporter = nodemailer.createTransport({
      host: configService.getEnv("MAIL_HOST"),
      port: Number(configService.getEnv("MAIL_PORT")),
      auth: null
    });
  }

  sendMail(mailOptions: Mail.Options): Promise<SMTPTransport.SentMessageInfo> {
    return this.transporter.sendMail({
      from: "TodoList <dev@todolist.com.br>",
      ...mailOptions
    });
  }

  async sendActivationCodeMail(userId: number, name: string, email: string, activationCode: string): Promise<SMTPTransport.SentMessageInfo> {
    const apiEntryPoint = this.configService.getApiEntryPoint();
    const url = new URL(`${apiEntryPoint}/otp/verify`);
    url.searchParams.append("userId", `${userId}`);
    url.searchParams.append("otpCode", activationCode);
    url.searchParams.append("otpUseCase", OtpUseCase.AccountActivation);

    const activationUrl = url.toString();
    const appName = this.i18n.t("all.app.name");
    const title = this.i18n.t("mail.activate_account.title");
    const thanks = this.i18n.t("mail.activate_account.thanks_for_registering");
    const welcome = this.i18n.t("mail.activate_account.welcome_to", {args: {app_name: appName}});
    const yourActivationCodeIs = this.i18n.t("mail.activate_account.your_activation_code_is");
    // const clickButton = this.i18n.t("mail.activate_account.click_button");
    const pleaseIgnore = this.i18n.t("mail.activate_account.please_ignore");
    const copyRightYear = this.i18n.t("all.copyright.year");
    const copyRightName = this.i18n.t("all.copyright.name");

    const html = this.resourcesService.getAssetFile("mail/activate_account.html");
    const htmlContent = html.toString();
    const template = Handlebars.compile(htmlContent);
    const templateRender = template({
      title         : title,
      welcome       : welcome,
      str1          : `${thanks} ${yourActivationCodeIs}:`,
      activationCode: activationCode,
      btnActivate   : title,
      str3          : pleaseIgnore,
      activationUrl : activationUrl,
      copyrightYear : copyRightYear,
      copyrightName : copyRightName
    });

    return this.sendMail({
      to     : `${name} <${email}>`,
      subject: `${appName} - ${title}`,
      html   : templateRender,
      text   : `${thanks} \n${yourActivationCodeIs} \"${activationCode}. \nFollow the link to activate your account ${activationUrl}. \n${pleaseIgnore}\"`
    })
  }
}