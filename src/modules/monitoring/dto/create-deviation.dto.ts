import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviationDto {
  @ApiProperty({ description: 'Date of the protocol deviation', example: '2026-03-10' })
  @IsDateString()
  deviationDate: string;

  @ApiProperty({ description: 'Description of the deviation from protocol' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ description: 'Impact on participants or study integrity' })
  @IsOptional()
  @IsString()
  impact?: string;

  @ApiPropertyOptional({ description: 'Corrective actions taken' })
  @IsOptional()
  @IsString()
  correctiveAction?: string;
}
