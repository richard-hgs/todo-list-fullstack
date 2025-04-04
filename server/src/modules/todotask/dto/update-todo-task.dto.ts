import { IsStringI18n } from "../../validators/decorators-i18n/is-string.i18n.decorator";
import { IsNotEmptyI18n } from "../../validators/decorators-i18n/is-not-empty.i18n.decorator";
import { MaxLengthI18n } from "../../validators/decorators-i18n/max-length.i18n.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "@prisma/client";
import { IsNumberI18n } from "../../validators/decorators-i18n/is-number.i18n.decorator";
import { IsGreaterThanZeroI18n } from "../../validators/decorators-i18n/is-greater-than-zero.i18n.decorator";

/**
 * CreateTodoTaskDto defines the structure and validation rules for a request payload
 * used to create a new task.
 */
export class UpdateTodoTaskDto {
  @IsNumberI18n()
  @IsGreaterThanZeroI18n()
  @ApiProperty({
    description: "Task identifier",
    example: "1"
  })
  id: number;

  @IsStringI18n()
  @IsNotEmptyI18n()
  @MaxLengthI18n(50)
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

  @IsStringI18n()
  @IsNotEmptyI18n()
  @ApiProperty({
    description: `TaskStatus should be one of (${Object.keys(TaskStatus)})`,
    example: "Pending"
  })
  status: TaskStatus;
}