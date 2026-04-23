import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { SubmitReviewDto } from './dto/submit-review.dto';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // POST /reviews
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start a review for an assigned application' })
  @ApiResponse({ status: 201, description: 'Review started.' })
  @ApiResponse({ status: 400, description: 'Already started.' })
  @ApiResponse({ status: 403, description: 'No active assignment.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  startReview(@Body() dto: CreateReviewDto, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.startReview(dto.applicationId, user.id);
  }

  // GET /reviews/application/:applicationId
  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get all reviews for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Reviews returned.' })
  findByApplication(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
  ) {
    return this.reviewsService.findByApplication(applicationId);
  }

  // GET /reviews/reviewer/:reviewerId
  @Get('reviewer/:reviewerId')
  @ApiOperation({ summary: "Get a reviewer's own reviews" })
  @ApiParam({ name: 'reviewerId', description: 'Reviewer UUID' })
  @ApiResponse({ status: 200, description: 'Reviews returned.' })
  findByReviewer(@Param('reviewerId', new ParseUUIDPipe()) reviewerId: string) {
    return this.reviewsService.findByReviewer(reviewerId);
  }

  // GET /reviews/assignments
  @Get('assignments')
  @ApiOperation({ summary: "Get the current reviewer's assignments" })
  @ApiResponse({ status: 200, description: 'Assignments returned.' })
  findAssignments(@CurrentUser() user: JwtPayload) {
    return this.reviewsService.findAssignmentsForReviewer(user.id);
  }

  // POST /reviews/assignments/:assignmentId/open
  @Post('assignments/:assignmentId/open')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get or create the review for an assignment (reviewer only)',
  })
  @ApiParam({ name: 'assignmentId', description: 'Review assignment UUID' })
  @ApiResponse({ status: 200, description: 'Review returned.' })
  @ApiResponse({
    status: 400,
    description: 'Assignment is inactive or conflicted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  openAssignmentReview(
    @Param('assignmentId', new ParseUUIDPipe()) assignmentId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.openReviewForAssignment(assignmentId, user.id);
  }

  // GET /reviews/:id
  @Get(':id')
  @ApiOperation({
    summary:
      'Get a single review by review UUID or review-assignment UUID (reviewer only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Review UUID or review assignment UUID',
  })
  @ApiResponse({ status: 200, description: 'Review returned.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.findOne(id, user.id);
  }

  // PATCH /reviews/:id/submit
  @Patch(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Submit a completed review by review UUID or review-assignment UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'Review UUID or review assignment UUID',
  })
  @ApiResponse({ status: 200, description: 'Review submitted.' })
  @ApiResponse({ status: 400, description: 'Already submitted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  submitReview(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SubmitReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.submitReview(id, user.id, dto);
  }
}
