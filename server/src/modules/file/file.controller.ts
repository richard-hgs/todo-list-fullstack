import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ResourcesService } from "../resources/resources.service";

@Controller('file')
@ApiTags('file')
export class FileController {

  constructor(
    private readonly resources: ResourcesService
  ) {}

  @Get(':filePath')
  @ApiParam({
    name: "filePath",
    type: "string",
    example: "todolist/users/1/1735333146622-plugin.png"
  })
  seeUploadedFile(@Param('filePath') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: this.resources.getFileUploadDir() });
  }
}