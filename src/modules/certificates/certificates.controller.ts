import {
  Controller,
  Get,
  Param,
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
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CertificatesService } from './certificates.service';

@ApiTags('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  // GET /certificates/application/:applicationId
  @ApiBearerAuth()
  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get certificate for an application (authenticated)' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Certificate returned.' })
  @ApiResponse({ status: 404, description: 'Certificate not found.' })
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.certificatesService.findByApplication(applicationId);
  }

  // GET /certificates/verify/:token — public
  @Public()
  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify a certificate by token (public)' })
  @ApiParam({ name: 'token', description: 'Verification token (UUID)' })
  @ApiResponse({ status: 200, description: 'Certificate verified.' })
  @ApiResponse({ status: 404, description: 'Invalid token.' })
  verify(@Param('token') token: string) {
    return this.certificatesService.verify(token);
  }

  // GET /certificates/application/:applicationId/download
  @ApiBearerAuth()
  @Get('application/:applicationId/download')
  @ApiOperation({ summary: 'Download certificate for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Certificate download info returned.' })
  @ApiResponse({ status: 404, description: 'Certificate not found.' })
  download(
    @Param('applicationId') applicationId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.certificatesService.download(applicationId, user.id);
  }
}
