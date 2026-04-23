import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateInstitutionDto {
  @ApiPropertyOptional({ example: 'Kenyatta National Hospital (Updated)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'RESEARCH_CENTER' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Hospital Road, Nairobi' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+254733000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'irb@knh.or.ke' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
