import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { DatabaseModule } from './common/database/database.module';
import { EmailModule } from './common/email/email.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './modules/auth/auth.module';
import { BootstrapModule } from './modules/bootstrap/bootstrap.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ApplicationDocumentsModule } from './modules/application-documents/application-documents.module';
import { QueriesModule } from './modules/queries/queries.module';
import { ReviewerAssignmentsModule } from './modules/reviewer-assignments/reviewer-assignments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { DecisionsModule } from './modules/decisions/decisions.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RegistryModule } from './modules/registry/registry.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';

/**
 * Root application module.
 *
 * Rate-limiting (ThrottlerModule) requires `@nestjs/throttler`:
 *   npm install @nestjs/throttler
 * Add it to imports once installed.
 */
@Module({
  imports: [
    // Configuration — globally available via ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),

    // Database access — globally available via DatabaseService
    DatabaseModule,

    // Email — globally available via EmailService
    EmailModule,

    // Feature modules
    BootstrapModule,
    AuthModule,
    UsersModule,
    RolesModule,
    TenantsModule,
    InstitutionsModule,
    WorkflowsModule,
    ApplicationsModule,
    ApplicationDocumentsModule,
    QueriesModule,

    // Review pipeline
    ReviewerAssignmentsModule,
    ReviewsModule,

    // Decisions & certificates
    CertificatesModule,
    DecisionsModule,

    // Payments
    InvoicesModule,
    ReceiptsModule,
    PaymentsModule,

    // Post-approval monitoring
    MonitoringModule,

    // Dashboards & analytics
    DashboardsModule,

    // Notifications
    NotificationsModule,

    // Public registry
    RegistryModule,

    // Audit trail
    AuditLogsModule,
  ],
  providers: [
    // Global JWT authentication guard — bypass with @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Global role-based authorization guard — restrict with @Roles(...)
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
