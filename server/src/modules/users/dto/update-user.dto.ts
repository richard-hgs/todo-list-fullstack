
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * CreateUserDto defines the structure and validation rules for a request payload
 * used to update an existing user.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}