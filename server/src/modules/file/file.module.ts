import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { ResourcesModule } from "../resources/resources.module";

@Module({
  imports: [ResourcesModule],
  controllers: [FileController]
})
export class FileModule {}