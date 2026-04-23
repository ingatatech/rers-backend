import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubmitApplicationDto {
  @ApiPropertyOptional({
    description: 'Optional submission note or declaration',
    example: 'I confirm all information is accurate.',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
