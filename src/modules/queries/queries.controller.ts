import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { CreateQueryDto } from './dto/create-query.dto';
import { RespondQueryDto } from './dto/respond-query.dto';
import { QueriesService } from './queries.service';

@ApiTags('queries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications/:id/queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  // ─── GET /applications/:id/queries ────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all queries for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Array of queries returned.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  findByApplication(@Param('id') id: string) {
    return this.queriesService.findByApplication(id);
  }

  // ─── POST /applications/:id/queries ───────────────────────────────────────────

  @Roles(
    UserRole.IRB_ADMIN,
    UserRole.RNEC_ADMIN,
    UserRole.SYSTEM_ADMIN,
    UserRole.CHAIRPERSON,
    UserRole.REVIEWER,
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Raise a query on an application (admin/reviewer roles)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Query raised.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  raiseQuery(
    @Param('id') id: string,
    @Body() dto: CreateQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.queriesService.raiseQuery(id, user.id, dto);
  }

  // ─── POST /applications/:id/queries/:queryId/respond ─────────────────────────

  @Post(':queryId/respond')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Respond to a query (any authenticated user)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiParam({ name: 'queryId', description: 'Query UUID' })
  @ApiResponse({ status: 201, description: 'Response recorded.' })
  @ApiResponse({ status: 400, description: 'Query is already resolved.' })
  @ApiResponse({ status: 404, description: 'Query or application not found.' })
  respondToQuery(
    @Param('id') id: string,
    @Param('queryId') queryId: string,
    @Body() dto: RespondQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.queriesService.respondToQuery(id, queryId, user.id, dto);
  }

  // ─── PATCH /applications/:id/queries/:queryId/resolve ────────────────────────

  @Roles(
    UserRole.IRB_ADMIN,
    UserRole.RNEC_ADMIN,
    UserRole.SYSTEM_ADMIN,
    UserRole.CHAIRPERSON,
    UserRole.REVIEWER,
  )
  @Patch(':queryId/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve a query (admin/reviewer roles)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiParam({ name: 'queryId', description: 'Query UUID' })
  @ApiResponse({ status: 200, description: 'Query resolved.' })
  @ApiResponse({ status: 400, description: 'Query is already resolved.' })
  @ApiResponse({ status: 404, description: 'Query or application not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  resolveQuery(
    @Param('id') id: string,
    @Param('queryId') queryId: string,
  ) {
    return this.queriesService.resolveQuery(id, queryId);
  }
}
