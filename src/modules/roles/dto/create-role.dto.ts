import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.REVIEWER })
  @IsEnum(UserRole)
  name: UserRole;

  @ApiPropertyOptional({ example: 'Can review submitted applications' })
  @IsOptional()
  @IsString()
  description?: string;
}
