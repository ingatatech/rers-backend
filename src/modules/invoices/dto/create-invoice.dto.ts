import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Invoice amount', example: 5000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Description of the invoice' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Due date for payment', example: '2026-05-01' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Currency code', default: 'KES', example: 'KES' })
  @IsOptional()
  @IsString()
  currency?: string;
}
