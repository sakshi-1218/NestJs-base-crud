import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsInt, Min, MaxLength, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Name must be a valid string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters long' })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'A valid email address of the user',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 25,
    description: 'Age of the user (optional). Must be greater than 0',
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Age must be an integer value' })
  @Min(1, { message: 'Age must be at least 1' })
  age?: number;
}
