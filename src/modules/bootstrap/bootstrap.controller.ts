import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { BootstrapService } from './bootstrap.service';
import { BootstrapDto } from './dto/bootstrap.dto';

@ApiTags('bootstrap')
@Controller('bootstrap')
export class BootstrapController {
  constructor(private readonly bootstrapService: BootstrapService) {}

  @Public()
  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'One-time system bootstrap — seeds roles and creates the first system admin',
    description: 'Disabled automatically after the first admin account exists.',
  })
  @ApiResponse({ status: 201, description: 'Bootstrap complete.' })
  @ApiResponse({ status: 409, description: 'System already bootstrapped.' })
  seed(@Body() dto: BootstrapDto) {
    return this.bootstrapService.seed(dto);
  }
}
