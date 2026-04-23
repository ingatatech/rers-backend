import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQueryDto {
  @ApiProperty({ example: 'Please clarify the sample size justification in Section 4.' })
  @IsNotEmpty()
  @IsString()
  question: string;
}
