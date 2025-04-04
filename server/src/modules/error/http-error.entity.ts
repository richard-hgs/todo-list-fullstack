import { ApiProperty } from "@nestjs/swagger";


export class HttpErrorEntity {
  @ApiProperty({
    description: "HTTP request error message",
    example: "Bad Request"
  })
  message: string;

  @ApiProperty({
    description: "HTTP request error code.",
    example: 400
  })
  statusCode: number;
}