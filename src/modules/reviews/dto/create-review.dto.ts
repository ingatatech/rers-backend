import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Application UUID to review' })
  @IsUUID()
  applicationId: string;
}
