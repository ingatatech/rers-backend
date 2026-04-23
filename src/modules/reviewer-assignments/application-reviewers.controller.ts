import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { AssignApplicationReviewerDto } from './dto/assign-application-reviewer.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications/:applicationId/reviewers')
export class ApplicationReviewersController {
  constructor(
    private readonly reviewerAssignmentsService: ReviewerAssignmentsService,
  ) {}

  @Roles(UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign a reviewer to an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Assignment created.' })
  @ApiResponse({
    status: 400,
    description: 'Already assigned or invalid body.',
  })
  @ApiResponse({
    status: 404,
    description: 'Application or reviewer not found.',
  })
  assign(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() dto: AssignApplicationReviewerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewerAssignmentsService.assign(user.id, {
      applicationId,
      reviewerId: dto.reviewerId,
      dueDate: dto.dueDate,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviewer assignments for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Assignments returned.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  findByApplication(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
  ) {
    return this.reviewerAssignmentsService.findByApplication(applicationId);
  }
}
