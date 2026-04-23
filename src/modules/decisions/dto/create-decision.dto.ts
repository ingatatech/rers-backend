import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DecisionType } from '../../../common/enums';

export class CreateDecisionDto {
  @ApiProperty({ enum: DecisionType, description: 'Type of decision' })
  @IsEnum(DecisionType)
  type: DecisionType;

  @ApiProperty({ description: 'Rationale for the decision', minLength: 10 })
  @IsString()
  @MinLength(10)
  rationale: string;

  @ApiPropertyOptional({
    description: 'Conditions attached (for CONDITIONALLY_APPROVED)',
  })
  @IsOptional()
  @IsString()
  conditions?: string;
}
