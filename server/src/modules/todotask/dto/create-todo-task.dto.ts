import { IsStringI18n } from "../../validators/decorators-i18n/is-string.i18n.decorator";
import { IsNotEmptyI18n } from "../../validators/decorators-i18n/is-not-empty.i18n.decorator";
import { MaxLengthI18n } from "../../validators/decorators-i18n/max-length.i18n.decorator";
import { DontExistsI18n } from "../../validators/decorators-i18n/dont-exists.i18n.decorator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * CreateTodoTaskDto defines the structure and validation rules for a request payload
 * used to create a new task.
 */
export class CreateTodoTaskDto {
  @IsStringI18n()
  @IsNotEmptyI18n()
  @MaxLengthI18n(50)
  @DontExistsI18n("todoTask")
  @ApiProperty({
    description: "Task name",
    example: "Buy Apples"
  })
  name: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @ApiProperty({
    description: "Task description",
    example: "Go to EPA and buy apples at 15:30 O'Clock"
  })
  description: string;
}