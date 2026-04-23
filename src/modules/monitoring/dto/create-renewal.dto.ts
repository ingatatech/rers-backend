import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRenewalDto {
  @ApiProperty({ description: 'Justification for renewal' })
  @IsString()
  @MinLength(10)
  justification: string;

  @ApiPropertyOptional({ description: 'Requested extension period', example: '12 months' })
  @IsOptional()
  @IsString()
  extensionPeriod?: string;
}
