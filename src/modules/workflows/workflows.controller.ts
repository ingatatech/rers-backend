import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { WorkflowsService } from './workflows.service';

@ApiTags('workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications/:id/workflow')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  // ─── GET /applications/:id/workflow ──────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get the workflow timeline for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Workflow timeline returned.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  getTimeline(@Param('id') id: string) {
    return this.workflowsService.getTimeline(id);
  }
}
