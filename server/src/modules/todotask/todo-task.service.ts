import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTodoTaskDto } from "./dto/create-todo-task.dto";
import { PrismaBaseService } from "../prisma/prisma-base.service";
import { UpdateTodoTaskDto } from "./dto/update-todo-task.dto";
import { TaskStatus } from "@prisma/client";

@Injectable()
export class TodoTaskService {

  constructor(private readonly prisma: PrismaBaseService) {
  }

  async findAll(userId: number) {
      return this.prisma.todoTask.findMany({
        where: {
          userId: userId,
        }
      })
  }

  async findAllWithStatus(userId: number, status: TaskStatus) {
    return this.prisma.todoTask.findMany({
      where: {
        userId: userId,
        status: status
      }
    })
  }

  async create(todoTask: CreateTodoTaskDto, userId: number) {
    // Create task
    return this.prisma.todoTask.create({
      data: {
        userId     : userId,
        name       : todoTask.name,
        description: todoTask.description
      },
    });
  }

  async update(todoTask: UpdateTodoTaskDto, userId: number) {
    // Check if duplicate task name exists
    const taskNameExists = await this.prisma.todoTask.findMany({
      where: {
        name: todoTask.name
      }
    });

    if (
      taskNameExists.length > 1 ||
      taskNameExists.find((item) => item.id !== todoTask.id)
    ) {
      // Duplicated task name
      throw new BadRequestException("Task name already exists.");
    }

    const taskToUpdate = await this.prisma.todoTask.findUnique({
      where: {
        id: todoTask.id,
        userId: userId
      }
    });

    if (!taskToUpdate) {
      throw new BadRequestException("Task not found.");
    }

    // Update task
    return this.prisma.todoTask.update({
      data: {
        name       : todoTask.name,
        description: todoTask.description,
        status     : todoTask.status
      },
      where: {
        id    : taskToUpdate.id,
        userId: taskToUpdate.userId,
      }
    });
  }

  async delete(taskId: number, userId: number) {
    const taskToDelete = await this.prisma.todoTask.count({
      where: {
        id: taskId,
        userId: userId
      }
    });

    if (!taskToDelete) {
      throw new BadRequestException("Task not found.");
    }

    return this.prisma.todoTask.delete({
      where: {
        id: taskId,
        userId: userId
      }
    })
  }
}