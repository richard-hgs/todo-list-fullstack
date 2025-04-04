import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "../../../generated/i18n.generated";
import { Match } from "../decorators/match.decorator";

export function MatchI18n(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const optionsWithMessage: ValidationOptions = {
      message: i18nValidationMessage<I18nTranslations>('validation.match'),
      ...validationOptions,
    };
    Match(property, optionsWithMessage)(object, propertyName);
  };
}