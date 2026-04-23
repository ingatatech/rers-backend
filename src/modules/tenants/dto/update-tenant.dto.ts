import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateTenantDto {
  @ApiPropertyOptional({ example: 'University of Nairobi (Updated)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'HOSPITAL' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'https://example.com/new-logo.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'P.O. Box 999, Nairobi' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+254711000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'admin@hospital.org' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Arbitrary JSON settings object' })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}
