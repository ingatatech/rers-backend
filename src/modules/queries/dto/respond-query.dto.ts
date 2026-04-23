import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RespondQueryDto {
  @ApiProperty({ example: 'The sample size was computed using a power analysis with 80% power...' })
  @IsNotEmpty()
  @IsString()
  response: string;
}
