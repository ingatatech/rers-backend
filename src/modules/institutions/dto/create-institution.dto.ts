import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInstitutionDto {
  @ApiProperty({ example: 'Kenyatta National Hospital' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'KNH', description: 'Unique short code' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'HOSPITAL' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'UUID of the parent tenant' })
  @IsNotEmpty()
  @IsUUID()
  tenantId: string;

  @ApiPropertyOptional({ example: 'Upper Hill, Nairobi' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+254722000001' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'ethics@knh.or.ke' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
