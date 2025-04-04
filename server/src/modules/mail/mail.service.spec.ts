import { MailService } from './mail.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from "../config/config.service";
import { ResourcesService } from "../resources/resources.service";
import { mockI18nService } from "../../utils/tests/utils";
import { I18nService } from "nestjs-i18n";

describe('MailService', () => {
  let service: MailService;
  let resourcesService: ResourcesService;

  const i18nService = mockI18nService(() => resourcesService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        ResourcesService,
        ConfigService,
        {
          provide: I18nService,
          useValue: i18nService
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    resourcesService = module.get<ResourcesService>(ResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an activation code email with the correct content', async () => {
    const id = 1;
    const name = 'Test User';
    const email = 'test@example.com';
    const activationCode = "123456";

    // Mock the transporter's sendMail method
    service.transporter.sendMail = jest.fn().mockResolvedValueOnce({} as any);

    await service.sendActivationCodeMail(id, name, email, activationCode);

    expect(service.transporter.sendMail).toHaveBeenCalledWith({
      from: "TodoList <dev@todolist.com.br>",
      to: `${name} <${email}>`,
      subject: `${i18nService.t("all.app.name")} - ${i18nService.t("mail.activate_account.title")}`,
      html: expect.any(String),
      text: expect.any(String)
    });
  });
});