import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeverityLevel } from '../../../common/enums';

export class CreateAdverseEventDto {
  @ApiProperty({ description: 'Date the adverse event occurred', example: '2026-03-15' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ description: 'Description of the adverse event' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ enum: SeverityLevel, description: 'Severity of the adverse event' })
  @IsEnum(SeverityLevel)
  severity: SeverityLevel;

  @ApiPropertyOptional({ description: 'Number of affected participants', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  affectedParticipants?: number;

  @ApiPropertyOptional({ description: 'Actions taken in response to the event' })
  @IsOptional()
  @IsString()
  actionTaken?: string;
}
