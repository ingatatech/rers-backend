import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DecisionsService } from './decisions.service';
import { CreateDecisionDto } from './dto/create-decision.dto';

@ApiTags('decisions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('decisions')
export class DecisionsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  // POST /decisions/application/:applicationId
  @Roles(UserRole.CHAIRPERSON)
  @Post('application/:applicationId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record the final decision for an application (CHAIRPERSON only)' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Decision recorded.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  record(
    @Param('applicationId') applicationId: string,
    @Body() dto: CreateDecisionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.decisionsService.record(applicationId, user.id, dto);
  }

  // GET /decisions/application/:applicationId
  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get all decisions for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Decisions returned.' })
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.decisionsService.findByApplication(applicationId);
  }

  // GET /decisions/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a single decision by id' })
  @ApiParam({ name: 'id', description: 'Decision UUID' })
  @ApiResponse({ status: 200, description: 'Decision returned.' })
  @ApiResponse({ status: 404, description: 'Decision not found.' })
  findOne(@Param('id') id: string) {
    return this.decisionsService.findOne(id);
  }
}
