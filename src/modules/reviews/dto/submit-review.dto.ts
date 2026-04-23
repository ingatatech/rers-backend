import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewRecommendation } from '../../../common/enums';

export class SubmitReviewDto {
  @ApiProperty({ description: 'Review comments', minLength: 10 })
  @IsString()
  @MinLength(10)
  comments: string;

  @ApiProperty({
    enum: ReviewRecommendation,
    description: 'Reviewer recommendation',
  })
  @IsEnum(ReviewRecommendation)
  recommendation: ReviewRecommendation;

  @ApiPropertyOptional({
    description: 'Conditions attached to the recommendation',
  })
  @IsOptional()
  @IsString()
  conditions?: string;
}
