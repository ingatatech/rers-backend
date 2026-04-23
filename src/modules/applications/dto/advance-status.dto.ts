import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AdvanceStatusDto {
  @ApiProperty({ enum: ApplicationStatus, description: 'Target status to transition to' })
  @IsEnum(ApplicationStatus)
  toStatus: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Reason for the status change' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
