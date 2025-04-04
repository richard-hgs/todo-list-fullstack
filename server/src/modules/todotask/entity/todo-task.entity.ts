import { TodoTask, TaskStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class TodoTaskEntity implements TodoTask {
  constructor(partial: Partial<TodoTaskEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: "Task unique auto increment identifier",
    example: 1
  })
  id: number;

  @ApiProperty({
    description: "User owner of the task",
    example: 1
  })
  userId: number;

  @ApiProperty({
    description: `User status should be one of (${Object.keys(TaskStatus)})`,
    example: "Active"
  })
  status: TaskStatus;

  @ApiProperty({
    description: "Todo task name",
    example: "Buy Apples"
  })
  name: string;

  @ApiProperty({
    description: "User email",
    example: "testes@testes.com"
  })
  description: string;

  @ApiProperty({
    description: "Task registration date",
    example: "2024-10-15 20:25:32"
  })
  createdAt: Date;

  @ApiProperty({
    description: "Task last info update date",
    example: "2024-10-15 20:25:32"
  })
  updatedAt: Date;
}