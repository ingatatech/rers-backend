import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApplicationType } from '../../../common/enums';

export class UpdateApplicationDto {
  @ApiPropertyOptional({ example: 'Updated Study Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    enum: ApplicationType,
    description: 'Updated application type',
  })
  @IsOptional()
  @IsEnum(ApplicationType)
  type?: ApplicationType;

  @ApiPropertyOptional({ description: 'Updated IRB tenant UUID' })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'UUID of the destination institution' })
  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @ApiPropertyOptional({ example: 'Dr. Updated Investigator' })
  @IsOptional()
  @IsString()
  principalInvestigator?: string;

  @ApiPropertyOptional({ example: ['Dr. Co-Investigator 1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coInvestigators?: string[];

  @ApiPropertyOptional({ example: '18 months' })
  @IsOptional()
  @IsString()
  studyDuration?: string;

  @ApiPropertyOptional({ example: '2025-03-01' })
  @IsOptional()
  @IsDateString()
  studyStartDate?: string;

  @ApiPropertyOptional({ example: '2026-09-30' })
  @IsOptional()
  @IsDateString()
  studyEndDate?: string;

  @ApiPropertyOptional({ example: 'Urban adults aged 18-60' })
  @IsOptional()
  @IsString()
  population?: string;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sampleSize?: number;

  @ApiPropertyOptional({ example: 'Cross-sectional survey' })
  @IsOptional()
  @IsString()
  methodology?: string;

  @ApiPropertyOptional({ example: 'WHO Grant' })
  @IsOptional()
  @IsString()
  fundingSource?: string;

  @ApiPropertyOptional({ example: 75000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  budget?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ethicsStatement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  consentDescription?: string;

  @ApiPropertyOptional({ description: 'Arbitrary form data as JSON object' })
  @IsOptional()
  @IsObject()
  formData?: Record<string, unknown>;
}
