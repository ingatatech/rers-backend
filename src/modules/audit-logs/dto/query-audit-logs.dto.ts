import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAuditLogsDto {
  @ApiPropertyOptional({ description: 'Filter by actor (user) UUID' })
  @IsOptional()
  @IsUUID()
  actorId?: string;

  @ApiPropertyOptional({ description: 'Filter by action name', example: 'CREATE_APPLICATION' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ description: 'Filter by target entity', example: 'Application' })
  @IsOptional()
  @IsString()
  targetEntity?: string;

  @ApiPropertyOptional({ description: 'Filter by tenant UUID' })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'Filter from date (ISO 8601)', example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter to date (ISO 8601)', example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ description: 'Page size', example: 20 })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
