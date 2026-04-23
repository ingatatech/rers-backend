import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryTenantDto {
  @ApiPropertyOptional({ description: 'Filter by active status', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @ApiPropertyOptional({ description: 'Filter by tenant type', example: 'UNIVERSITY' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Search by name (partial match)', example: 'Nairobi' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number (1-based)', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Items per page', example: '20' })
  @IsOptional()
  @IsNumberString()
  pageSize?: string;
}
