import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class BootstrapDto {
  @ApiProperty({ example: 'admin@rnec.go.ke' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin@123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
