import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'Application UUID to assign reviewer to' })
  @IsUUID()
  applicationId: string;

  @ApiProperty({ description: 'Reviewer user UUID' })
  @IsUUID()
  reviewerId: string;

  @ApiPropertyOptional({ description: 'Optional due date for the review' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
