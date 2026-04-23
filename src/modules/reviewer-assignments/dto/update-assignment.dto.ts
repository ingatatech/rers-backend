import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAssignmentDto {
  @ApiPropertyOptional({ description: 'Whether the assignment is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Reason for conflict of interest' })
  @IsOptional()
  @IsString()
  conflictReason?: string;
}
