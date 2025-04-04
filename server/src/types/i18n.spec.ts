import { ResourcesService } from "../modules/resources/resources.service";
import { mockResourcesService } from "../utils/tests/utils";
import fs from "fs";
import { _AcceptedLanguages, isAcceptedLanguage } from "./i18n";

describe("i18n Types tests", () => {
  let resourcesService: ResourcesService

  beforeEach(async () => {
    resourcesService = await mockResourcesService()
  });

  it("Verify if translations exists in AcceptedLanguages type", () => {
    const i18nDir = resourcesService.getI18nDir();
    const i18nLanguages = fs.readdirSync(i18nDir);

    i18nLanguages.forEach((language) => {
      expect(language).toBeOneOf(_AcceptedLanguages);
    });
  });

  it("Verify if AcceptedLanguages are translated", () => {
    const i18nDir = resourcesService.getI18nDir();
    const i18nLanguages = fs.readdirSync(i18nDir);

    _AcceptedLanguages.forEach((language) => {
      expect(language).toBeOneOf(i18nLanguages);
    });
  });

  it('should act as a type guard', () => {
    const lang = 'en-US';

    if (isAcceptedLanguage(lang)) {
      // Here, TypeScript knows that 'lang' is of type AcceptedLanguages
      expect(lang.toUpperCase()).toBe('EN-US');
    } else {
      // Here, TypeScript knows that 'lang' is still of type string
    }
  });

  // it("Verify if some translation is missing", () => {
  //   const i18nDir = resourcesService.getI18nDir();
  //   const i18nLanguages = fs.readdirSync(i18nDir);
  // });
});