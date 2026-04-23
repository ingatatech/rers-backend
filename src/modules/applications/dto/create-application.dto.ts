import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApplicationType } from '../../../common/enums';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Efficacy of Malaria Vaccine in Children Under 5' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ enum: ApplicationType, example: ApplicationType.FULL_BOARD })
  @IsEnum(ApplicationType)
  type: ApplicationType;

  @ApiPropertyOptional({ description: 'UUID of the IRB tenant the applicant is submitting to' })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'UUID of the destination institution' })
  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @ApiPropertyOptional({ example: 'Dr. Jane Doe' })
  @IsOptional()
  @IsString()
  principalInvestigator?: string;

  @ApiPropertyOptional({ example: ['Dr. John Smith', 'Dr. Alice Mwangi'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coInvestigators?: string[];

  @ApiPropertyOptional({ example: '12 months' })
  @IsOptional()
  @IsString()
  studyDuration?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  studyStartDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  studyEndDate?: string;

  @ApiPropertyOptional({ example: 'Children aged 0-5 in rural Kenya' })
  @IsOptional()
  @IsString()
  population?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sampleSize?: number;

  @ApiPropertyOptional({ example: 'Randomized Controlled Trial' })
  @IsOptional()
  @IsString()
  methodology?: string;

  @ApiPropertyOptional({ example: 'NIH Grant No. XYZ123' })
  @IsOptional()
  @IsString()
  fundingSource?: string;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  budget?: number;

  @ApiPropertyOptional({ example: 'This research upholds the principles of beneficence...' })
  @IsOptional()
  @IsString()
  ethicsStatement?: string;

  @ApiPropertyOptional({ example: 'Participants will be informed of their right to withdraw...' })
  @IsOptional()
  @IsString()
  consentDescription?: string;

  @ApiPropertyOptional({ description: 'Arbitrary form data as JSON object' })
  @IsOptional()
  @IsObject()
  formData?: Record<string, unknown>;
}
