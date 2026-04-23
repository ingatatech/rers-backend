import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class AssignApplicationReviewerDto {
  @ApiProperty({ description: 'Reviewer user UUID' })
  @IsUUID()
  reviewerId: string;

  @ApiPropertyOptional({ description: 'Optional due date for the review' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description:
      'Optional application UUID in the body; the route parameter takes precedence',
  })
  @IsOptional()
  @IsUUID()
  applicationId?: string;
}
