import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAmendmentDto {
  @ApiProperty({ description: 'Amendment title' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ description: 'Detailed description of the amendment' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ description: 'Reason for the amendment' })
  @IsString()
  @MinLength(10)
  reason: string;
}
