import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus, ApplicationType } from '../../../common/enums';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class QueryApplicationsDto {
  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({ enum: ApplicationType })
  @IsOptional()
  @IsEnum(ApplicationType)
  type?: ApplicationType;

  @ApiPropertyOptional({ description: 'Filter by tenant UUID' })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'Filter by applicant UUID' })
  @IsOptional()
  @IsUUID()
  applicantId?: string;

  @ApiPropertyOptional({ description: 'Search by title (partial match)' })
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

  @ApiPropertyOptional({
    description: 'Alias for pageSize; accepted for compatibility with limit-based clients',
    example: '20',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
