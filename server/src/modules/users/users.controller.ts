import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiCreatedResponse, ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ValidationErrorEntity } from "../validators/entity/validation-error.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AdmAuthGuard } from "../auth/adm-auth.guard";
import { Request } from "express";
import { User } from "@prisma/client";
import { HttpErrorEntity } from "../error/http-error.entity";
import { ParseSafeIntPipe } from "../validators/pipes/parse-safe-int.pipe";

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @ApiCreatedResponse({type: UserEntity, description: "User registered with success."})
  @ApiBadRequestResponse({
    type       : ValidationErrorEntity,
    description: "Validation error, one or more request fields are invalid.",
    example    : {
      "message"   : [
        "User name already exists",
        "User email already exists"
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
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity, description: "Retrieve current authenticated user information"})
  @ApiUnauthorizedResponse({
    type       : HttpErrorEntity,
    description: "Unauthorized error in case of failure",
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
  async findMe(@Req() req: Request) {
    const user = req.user as User;
    return new UserEntity(await this.usersService.findOneById(user.id));
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdmAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity, isArray: true, description: "List all registered users"})
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
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, AdmAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity, description: "Find a registered user by id"})
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
    description: "Unauthorized error in case of failure due to user not found in adm auth guard.",
    example    : {
      "message"   : "Unauthorized 1",
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
  async findOne(@Param('id', new ParseSafeIntPipe("param", "id")) id: number) {
    return new UserEntity(await this.usersService.findOneById(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdmAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({type: UserEntity, description: "Update all properties of a registered user by id"})
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
    description: "Unauthorized error in case of failure in adm auth guard, due to user role not allowed. In this case user has (Common) user role",
    example    : {
      "message"   : "Unauthorized 2 (Common)",
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdmAuthGuard)
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }
}