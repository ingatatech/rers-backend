import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProgressReportDto {
  @ApiProperty({ description: 'Reporting period', example: 'Q1 2026' })
  @IsString()
  @MinLength(2)
  reportPeriod: string;

  @ApiProperty({ description: 'Summary of progress during the period' })
  @IsString()
  @MinLength(10)
  summary: string;

  @ApiPropertyOptional({ description: 'Number of participants enrolled so far', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  participantsEnrolled?: number;

  @ApiPropertyOptional({ description: 'Key findings from the study period' })
  @IsOptional()
  @IsString()
  findings?: string;
}
