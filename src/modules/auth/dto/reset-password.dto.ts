import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token received via email/response' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NewP@ss!', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
