import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ScreeningAction {
  PASS = 'PASS',
  RAISE_QUERY = 'RAISE_QUERY',
  REQUEST_PAYMENT = 'REQUEST_PAYMENT',
}

export class ScreenApplicationDto {
  @ApiProperty({
    enum: ScreeningAction,
    description:
      'PASS → UNDER_REVIEW, RAISE_QUERY → QUERY_RAISED, REQUEST_PAYMENT → PAYMENT_PENDING',
  })
  @IsEnum(ScreeningAction)
  action: ScreeningAction;

  @ApiPropertyOptional({ description: 'Optional reason or notes for this screening decision' })
  @IsOptional()
  @IsString()
  reason?: string;
}
