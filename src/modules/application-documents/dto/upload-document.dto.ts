import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '../../../common/enums';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    description: 'Type/category of the document being uploaded',
    example: DocumentType.PROTOCOL,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiPropertyOptional({
    description: 'Document version number (defaults to 1)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  version?: number;
}
