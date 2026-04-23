import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { RegistryService } from './registry.service';

@ApiTags('registry')
@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  // GET /registry — public
  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse the public ethics registry of approved studies' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({ name: 'type', required: false, description: 'ApplicationType filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title' })
  @ApiResponse({ status: 200, description: 'Paginated registry returned.' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.registryService.findAll({ page, pageSize, type, search });
  }

  // GET /registry/verify/:token — public
  @Public()
  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify an ethics certificate by token (public)' })
  @ApiParam({ name: 'token', description: 'Certificate verification token (UUID)' })
  @ApiResponse({ status: 200, description: 'Certificate verified.' })
  @ApiResponse({ status: 404, description: 'Invalid token.' })
  verifyCertificate(@Param('token') token: string) {
    return this.registryService.verifyCertificate(token);
  }

  // GET /registry/:id — public
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get public details of an approved study' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Study details returned.' })
  @ApiResponse({ status: 404, description: 'Study not found in registry.' })
  findOne(@Param('id') id: string) {
    return this.registryService.findOne(id);
  }
}
