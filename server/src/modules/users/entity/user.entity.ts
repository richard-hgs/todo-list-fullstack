import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole, UserStatus } from "@prisma/client";
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: "User unique auto increment identifier",
    example: 1
  })
  id: number;

  @ApiProperty({
    description: `User status should be one of (${Object.keys(UserStatus)})`,
    example: "Active"
  })
  status: UserStatus;

  @ApiProperty({
    description: `User role should be one of (${Object.keys(UserRole)})`,
    example: "Active"
  })
  role: UserRole;

  @ApiProperty({
    description: "User name",
    example: "Test User"
  })
  name: string;

  @ApiProperty({
    description: "User email",
    example: "testes@testes.com"
  })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: "User registration date",
    example: "2024-10-15 20:25:32"
  })
  createdAt: Date;

  @ApiProperty({
    description: "User last info update date",
    example: "2024-10-15 20:25:32"
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Indicates whether the user has activated his email.",
    example: true
  })
  isEmailActivated: boolean;
}