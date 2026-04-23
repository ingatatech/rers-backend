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
import { ReviewerAssignmentsService } from './reviewer-assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@ApiTags('reviewer-assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviewer-assignments')
export class ReviewerAssignmentsController {
  constructor(
    private readonly reviewerAssignmentsService: ReviewerAssignmentsService,
  ) {}

  // POST /reviewer-assignments
  @Roles(UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign a reviewer to an application (IRB_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Assignment created.' })
  @ApiResponse({ status: 400, description: 'Already assigned.' })
  @ApiResponse({ status: 404, description: 'Application or reviewer not found.' })
  assign(
    @Body() dto: CreateAssignmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewerAssignmentsService.assign(user.id, dto);
  }

  // GET /reviewer-assignments/application/:applicationId
  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get all assignments for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Assignments returned.' })
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.reviewerAssignmentsService.findByApplication(applicationId);
  }

  // GET /reviewer-assignments/reviewer/:reviewerId
  @Get('reviewer/:reviewerId')
  @ApiOperation({ summary: 'Get all assignments for a reviewer' })
  @ApiParam({ name: 'reviewerId', description: 'Reviewer user UUID' })
  @ApiResponse({ status: 200, description: 'Assignments returned.' })
  findByReviewer(@Param('reviewerId') reviewerId: string) {
    return this.reviewerAssignmentsService.findByReviewer(reviewerId);
  }

  // PATCH /reviewer-assignments/:id/conflict
  @Roles(UserRole.REVIEWER)
  @Patch(':id/conflict')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Declare conflict of interest on assignment (REVIEWER)' })
  @ApiParam({ name: 'id', description: 'Assignment UUID' })
  @ApiResponse({ status: 200, description: 'Conflict declared.' })
  @ApiResponse({ status: 400, description: 'Already declared or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  declareConflict(
    @Param('id') id: string,
    @Body() dto: UpdateAssignmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewerAssignmentsService.declareConflict(
      id,
      user.id,
      dto.conflictReason ?? '',
    );
  }

  // PATCH /reviewer-assignments/:id/deactivate
  @Roles(UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate an assignment (IRB_ADMIN)' })
  @ApiParam({ name: 'id', description: 'Assignment UUID' })
  @ApiResponse({ status: 200, description: 'Assignment deactivated.' })
  @ApiResponse({ status: 400, description: 'Already inactive.' })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  deactivate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reviewerAssignmentsService.deactivate(id, user.id);
  }
}
