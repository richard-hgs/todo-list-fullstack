import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { UserEntity } from "../users/entity/user.entity";
import { ValidationErrorEntity } from "../validators/entity/validation-error.entity";
import { HttpErrorEntity } from "../error/http-error.entity";
import { TodoTaskService } from "./todo-task.service";
import { CreateTodoTaskDto } from "./dto/create-todo-task.dto";
import { TodoTaskEntity } from "./entity/todo-task.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TaskStatus, User } from "@prisma/client";
import { UserParam } from "../validators/decorators/get-user.param.decorator";
import { UpdateTodoTaskDto } from "./dto/update-todo-task.dto";
import { AdmAuthGuard } from "../auth/adm-auth.guard";

@Controller("todo-task")
@ApiTags("todo-task")
export class TodoTaskController {

  constructor(private readonly todoTaskService: TodoTaskService) {
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({type: UserEntity, description: "Todo task created with success."})
  @ApiBadRequestResponse({
    type       : ValidationErrorEntity,
    description: "Validation error, one or more request fields are invalid.",
    example    : {
      "message"   : [
        "Task name already exists"
      ],
      "error"     : "Bad Request",
      "statusCode": 400
    }
  })
  @ApiInternalServerErrorResponse({
    type       : HttpErrorEntity,
    description: "Internal server error in case of server errors.",
    example    : {
      "message"   : "Internal server error",
      "statusCode": 500
    }
  })
  async create(
    @UserParam() user: User,
    @Body() createTodoTaskDto: CreateTodoTaskDto
  ) {
    return new TodoTaskEntity(await this.todoTaskService.create(createTodoTaskDto, user.id));
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({type: UserEntity, description: "Todo task created with success."})
  @ApiBadRequestResponse({
    type       : ValidationErrorEntity,
    description: "Validation error, one or more request fields are invalid.",
    example    : {
      "message"   : [
        "Task name already exists"
      ],
      "error"     : "Bad Request",
      "statusCode": 400
    }
  })
  @ApiInternalServerErrorResponse({
    type       : HttpErrorEntity,
    description: "Internal server error in case of server errors.",
    example    : {
      "message"   : "Internal server error",
      "statusCode": 500
    }
  })
  async update(
    @UserParam() user: User,
    @Body() updateTaskDto: UpdateTodoTaskDto
  ) {
    return new TodoTaskEntity(await this.todoTaskService.update(updateTaskDto, user.id));
  }

  @Get("/all")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: TodoTaskEntity, isArray: true, description: "List all created tasks"})
  @ApiUnauthorizedResponse({
    type       : HttpErrorEntity,
    description: "Unauthorized error in case of failure in jwt auth guard.",
    example    : {
      "message"   : "Unauthorized",
      "statusCode": 401
    }
  })
  @ApiInternalServerErrorResponse({
    type       : HttpErrorEntity,
    description: "Internal server error in case of server errors.",
    example    : {
      "message"   : "Internal server error",
      "statusCode": 500
    }
  })
  async findAll(
    @UserParam() user: User,
  ) {
    const tasks = await this.todoTaskService.findAll(user.id);
    return tasks.map((user) => new TodoTaskEntity(user));
  }

  @Get("all/:status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: TodoTaskEntity, isArray: true, description: "List all created tasks for a given status"})
  @ApiUnauthorizedResponse({
    type       : HttpErrorEntity,
    description: "Unauthorized error in case of failure in jwt auth guard.",
    example    : {
      "message"   : "Unauthorized",
      "statusCode": 401
    }
  })
  @ApiInternalServerErrorResponse({
    type       : HttpErrorEntity,
    description: "Internal server error in case of server errors.",
    example    : {
      "message"   : "Internal server error",
      "statusCode": 500
    }
  })
  @ApiParam({
    name: "status",
    type: "string",
    example: "Pending"
  })
  async findAllWithStatus(
    @UserParam() user: User,
    @Param('status', new ParseEnumPipe(TaskStatus)) taskStatus: TaskStatus
  ) {
    const tasks = await this.todoTaskService.findAllWithStatus(user.id, taskStatus);
    return tasks.map((user) => new TodoTaskEntity(user));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity, description: "Delete a registered user by id"})
  @ApiBadRequestResponse({
    type: HttpErrorEntity,
    description: "Pipe validation on a given param error.",
    example: {
      "message": "Validation failed (numeric string is expected). Param id (1235124512451245123)",
      "error": "Bad Request",
      "statusCode": 400
    }
  })
  @ApiUnauthorizedResponse({
    type       : HttpErrorEntity,
    description: "Unauthorized error in case of access token invalid",
    example    : {
      "message"   : "Unauthorized",
      "statusCode": 401
    }
  })
  @ApiInternalServerErrorResponse({
    type       : HttpErrorEntity,
    description: "Internal server error in case of server errors.",
    example    : {
      "message"   : "Internal server error",
      "statusCode": 500
    }
  })
  async remove(
    @UserParam() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    return new TodoTaskEntity(await this.todoTaskService.delete(id, user.id));
  }
}