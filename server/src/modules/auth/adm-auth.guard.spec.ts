import { Test, TestingModule } from "@nestjs/testing";
import { AdmAuthGuard } from "./adm-auth.guard";
import { I18nService } from "nestjs-i18n";
import { ResourcesService } from "../resources/resources.service";
import { HttpStatus } from "@nestjs/common";
import {
  mockExecutionContext,
  mockI18nService,
  mockResourcesService,
  mockUsers
} from "../../utils/tests/utils";
import { UserRole } from "@prisma/client";

describe("Adm auth guard tests", () => {
  let authGuard: AdmAuthGuard;
  let resourcesService: ResourcesService;

  const i18nService = mockI18nService(() => resourcesService);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        AdmAuthGuard,
        {
          provide: I18nService,
          useValue: i18nService
        }
      ],
    }).compile();

    authGuard = app.get<AdmAuthGuard>(AdmAuthGuard);
    resourcesService = await mockResourcesService();
  });

  it("Unauthorized - Expect user to not be signed in", () => {
    const executionContext = mockExecutionContext();
    const httpArgumentsHost = executionContext.switchToHttp();

    authGuard.canActivate(executionContext);

    expect(httpArgumentsHost.getResponse().status).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(httpArgumentsHost.getResponse().json).toBeCalledWith({
      message: i18nService.t("http-error.401.default"),
      statusCode: HttpStatus.UNAUTHORIZED
    });
  });

  it("Unauthorized - Expect user to not have admin privileges", () => {
    const executionContext = mockExecutionContext(
      undefined, undefined, undefined, {
        ...mockUsers().find(() => true),
        role: UserRole.Common
      }
    );
    const httpArgumentsHost = executionContext.switchToHttp();

    authGuard.canActivate(executionContext);

    expect(httpArgumentsHost.getResponse().status).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(httpArgumentsHost.getResponse().json).toBeCalledWith({
      message: `${i18nService.t("http-error.401.no_access")} (Common)`,
      statusCode: HttpStatus.UNAUTHORIZED
    });
  });

  it("OK - Expect user to have admin privileges", async () => {
    const executionContext = mockExecutionContext(
      undefined, undefined, undefined, {
        ...mockUsers().find(() => true),
        role: UserRole.Root
      }
    );
    const result = await authGuard.canActivate(executionContext);
    expect(result).toBe(true);
  });
});