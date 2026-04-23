import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty({ description: 'UUID of the permission to assign or remove' })
  @IsUUID()
  permissionId: string;
}
