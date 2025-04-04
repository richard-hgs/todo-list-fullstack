import { ApiProperty } from "@nestjs/swagger";

export class ValidationErrorEntity {
  constructor(partial: Partial<ValidationErrorEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: "List of error messages, informing validation errors.",
    example: [
      "Name already exists",
      "Email already exists"
    ]
  })
  message: string[];

  @ApiProperty({
    description: "HTTP request error message.",
    example: "Bad Request"
  })
  error: string;

  @ApiProperty({
    description: "HTTP request error code.",
    example: 400
  })
  statusCode: number;
}