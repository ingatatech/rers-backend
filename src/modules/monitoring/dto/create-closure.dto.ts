import { IsDateString, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClosureDto {
  @ApiProperty({ description: 'Date the study was closed', example: '2026-04-01' })
  @IsDateString()
  closureDate: string;

  @ApiProperty({ description: 'Description of the study closure' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ description: 'Total number of participants enrolled', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalEnrolled?: number;

  @ApiPropertyOptional({ description: 'Summary of study findings' })
  @IsOptional()
  @IsString()
  findings?: string;
}
