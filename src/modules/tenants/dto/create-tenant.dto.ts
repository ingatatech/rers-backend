import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TenantAdminDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Nkusi' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'admin@institution.ac.rw' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+250712345678' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateTenantDto {
  @ApiProperty({ example: 'University of Rwanda' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'UR-IRB', description: 'Unique short code for the tenant' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'UNIVERSITY', description: 'Type of institution' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'P.O. Box 30197, Kigali' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+250722000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'irb@university.ac.rw' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Arbitrary JSON settings object' })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;

  @ApiProperty({ description: 'IRB admin account to auto-create for this tenant' })
  @ValidateNested()
  @Type(() => TenantAdminDto)
  admin: TenantAdminDto;
}
