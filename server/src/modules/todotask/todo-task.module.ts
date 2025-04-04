import { Module } from "@nestjs/common";
import { PrismaBaseModule } from "../prisma/prisma-base.module";
import { TodoTaskService } from "./todo-task.service";
import { TodoTaskController } from "./todo-task.controller";

@Module({
  imports: [PrismaBaseModule],
  controllers: [TodoTaskController],
  providers: [TodoTaskService],
})
export class TodoTaskModule {}