import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiPropertyOptional({ description: 'Verification notes or remarks' })
  @IsOptional()
  @IsString()
  notes?: string;
}
