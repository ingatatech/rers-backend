import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ApplicationStatus,
  ApplicationType,
  DecisionType,
  DocumentType,
  MonitoringStatus,
  NotificationType,
  PaymentStatus,
  ReviewRecommendation,
  SeverityLevel,
  UserRole,
} from '../../common/enums';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar',  unique: true })
  code: string;

  @Column()
  type: string;

  @Column({ nullable: true, type: 'varchar' })
  logoUrl: string | null;

  @Column({ nullable: true, type: 'varchar' })
  address: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;

  @Column({ nullable: true, type: 'varchar' })
  email: string | null;

  @Column({ type: 'boolean',  default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Application, (application) => application.tenant)
  applications: Application[];

  @OneToMany(() => Institution, (institution) => institution.tenant)
  institutions: Institution[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.tenant)
  auditLogs: AuditLog[];
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'UserRole',
    unique: true,
  })
  name: UserRole;

  @Column({ nullable: true, type: 'varchar' })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  permissions: RolePermission[];
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar',  unique: true })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string | null;

  @Column()
  resource: string;

  @Column()
  action: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  roles: RolePermission[];
}

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn()
  roleId: string;

  @PrimaryColumn()
  permissionId: string;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar',  unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;

  @Column({ type: 'boolean',  default: true })
  isActive: boolean;

  @Column({ type: 'boolean',  default: false })
  isVerified: boolean;

  @Column({ nullable: true, type: 'varchar' })
  otpCode: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiresAt: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  resetToken: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  resetExpiresAt: Date | null;

  @Column({ nullable: true, type: 'timestamp' })
  lastLoginAt: Date | null;

  @Column({ type: 'boolean', default: true })
  firstLogin: boolean;

  @Column({ nullable: true, type: 'varchar' })
  tenantId: string | null;

  @Column()
  roleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant | null;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToOne(() => ApplicantProfile, (applicantProfile) => applicantProfile.user)
  applicantProfile: ApplicantProfile | null;

  @OneToMany(() => Application, (application) => application.applicant)
  applications: Application[];

  @OneToMany(() => ReviewAssignment, (reviewAssignment) => reviewAssignment.reviewer)
  reviewAssignments: ReviewAssignment[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.actor)
  auditLogs: AuditLog[];
}

@Entity('applicant_profiles')
export class ApplicantProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar',  unique: true })
  userId: string;

  @Column({ nullable: true, type: 'varchar' })
  institution: string | null;

  @Column({ nullable: true, type: 'varchar' })
  department: string | null;

  @Column({ nullable: true, type: 'varchar' })
  position: string | null;

  @Column({ nullable: true, type: 'varchar' })
  qualifications: string | null;

  @Column({ nullable: true, type: 'varchar' })
  orcidId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.applicantProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

@Entity('institutions')
export class Institution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar',  unique: true })
  code: string;

  @Column()
  type: string;

  @Column({ nullable: true, type: 'varchar' })
  address: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;

  @Column({ nullable: true, type: 'varchar' })
  email: string | null;

  @Column()
  tenantId: string;

  @Column({ type: 'boolean',  default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.institutions)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => Application, (application) => application.destination)
  applications: Application[];
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar',  unique: true, nullable: true })
  referenceNumber: string | null;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ApplicationType,
    enumName: 'ApplicationType',
  })
  type: ApplicationType;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus',
    default: ApplicationStatus.DRAFT,
  })
  status: ApplicationStatus;

  @Column({ nullable: true, type: 'varchar' })
  tenantId: string | null;

  @Column()
  applicantId: string;

  @Column({ nullable: true, type: 'varchar' })
  destinationId: string | null;

  @Column({ nullable: true, type: 'varchar' })
  principalInvestigator: string | null;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  coInvestigators: string[];

  @Column({ nullable: true, type: 'varchar' })
  studyDuration: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  studyStartDate: Date | null;

  @Column({ nullable: true, type: 'timestamp' })
  studyEndDate: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  population: string | null;

  @Column({ nullable: true, type: 'int' })
  sampleSize: number | null;

  @Column({ nullable: true, type: 'varchar' })
  methodology: string | null;

  @Column({ nullable: true, type: 'varchar' })
  fundingSource: string | null;

  @Column({ type: 'numeric', nullable: true })
  budget: string | null;

  @Column({ nullable: true, type: 'varchar' })
  ethicsStatement: string | null;

  @Column({ nullable: true, type: 'varchar' })
  consentDescription: string | null;

  @Column({ type: 'jsonb', nullable: true })
  formData: Record<string, unknown> | null;

  @Column({ nullable: true, type: 'timestamp' })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.applications)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'applicantId' })
  applicant: User;

  @ManyToOne(() => Institution, (institution) => institution.applications, {
    nullable: true,
  })
  @JoinColumn({ name: 'destinationId' })
  destination: Institution | null;

  @OneToMany(() => ApplicationDocument, (document) => document.application)
  documents: ApplicationDocument[];

  @OneToMany(
    () => WorkflowTransition,
    (workflowTransition) => workflowTransition.application,
  )
  workflowTransitions: WorkflowTransition[];

  @OneToMany(
    () => ReviewAssignment,
    (reviewAssignment) => reviewAssignment.application,
  )
  reviewAssignments: ReviewAssignment[];

  @OneToMany(() => Review, (review) => review.application)
  reviews: Review[];

  @OneToMany(() => Decision, (decision) => decision.application)
  decisions: Decision[];

  @OneToMany(() => Certificate, (certificate) => certificate.application)
  certificates: Certificate[];

  @OneToMany(() => Invoice, (invoice) => invoice.application)
  invoices: Invoice[];

  @OneToMany(() => Query, (query) => query.application)
  queries: Query[];

  @OneToMany(() => Amendment, (amendment) => amendment.application)
  amendments: Amendment[];

  @OneToMany(() => Renewal, (renewal) => renewal.application)
  renewals: Renewal[];

  @OneToMany(() => ProgressReport, (progressReport) => progressReport.application)
  progressReports: ProgressReport[];

  @OneToMany(() => AdverseEvent, (adverseEvent) => adverseEvent.application)
  adverseEvents: AdverseEvent[];

  @OneToMany(
    () => ProtocolDeviation,
    (protocolDeviation) => protocolDeviation.application,
  )
  protocolDeviations: ProtocolDeviation[];

  @OneToMany(() => ClosureReport, (closureReport) => closureReport.application)
  closureReports: ClosureReport[];
}

@Entity('application_documents')
export class ApplicationDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ nullable: true, type: 'varchar' })
  cloudinaryPublicId: string | null;

  @Column({
    type: 'enum',
    enum: DocumentType,
    enumName: 'DocumentType',
  })
  documentType: DocumentType;

  @Column({ type: 'int',  default: 1 })
  version: number;

  @Column({ nullable: true, type: 'varchar' })
  uploadedById: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Application, (application) => application.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('workflow_transitions')
export class WorkflowTransition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus',
    nullable: true,
  })
  fromStatus: ApplicationStatus | null;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus',
  })
  toStatus: ApplicationStatus;

  @Column({ nullable: true, type: 'varchar' })
  actorId: string | null;

  @Column({ nullable: true, type: 'varchar' })
  reason: string | null;

  @Column({ nullable: true, type: 'varchar' })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Application, (application) => application.workflowTransitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('review_assignments')
export class ReviewAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  reviewerId: string;

  @Column({ nullable: true, type: 'varchar' })
  assignedById: string | null;

  @Column({ type: 'boolean',  default: false })
  conflictDeclared: boolean;

  @Column({ nullable: true, type: 'varchar' })
  conflictReason: string | null;

  @Column({ type: 'boolean',  default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  dueDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.reviewAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @ManyToOne(() => User, (user) => user.reviewAssignments)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  reviewerId: string;

  @Column({ nullable: true, type: 'varchar' })
  comments: string | null;

  @Column({
    type: 'enum',
    enum: ReviewRecommendation,
    enumName: 'ReviewRecommendation',
    nullable: true,
  })
  recommendation: ReviewRecommendation | null;

  @Column({ nullable: true, type: 'varchar' })
  conditions: string | null;

  @Column({ type: 'boolean',  default: false })
  isComplete: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;
}

@Entity('queries')
export class Query {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column({ nullable: true, type: 'varchar' })
  raisedById: string | null;

  @Column()
  question: string;

  @Column({ type: 'boolean',  default: false })
  isResolved: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  resolvedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Application, (application) => application.queries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'raisedById' })
  raisedBy: User | null;

  @OneToMany(() => QueryResponse, (queryResponse) => queryResponse.query)
  responses: QueryResponse[];
}

@Entity('query_responses')
export class QueryResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  queryId: string;

  @Column({ nullable: true, type: 'varchar' })
  responderId: string | null;

  @Column()
  response: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Query, (query) => query.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'queryId' })
  query: Query;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'responderId' })
  responder: User | null;
}

@Entity('decisions')
export class Decision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column({
    type: 'enum',
    enum: DecisionType,
    enumName: 'DecisionType',
  })
  type: DecisionType;

  @Column({ nullable: true, type: 'varchar' })
  conditions: string | null;

  @Column({ nullable: true, type: 'varchar' })
  rationale: string | null;

  @Column({ nullable: true, type: 'varchar' })
  decidedById: string | null;

  @Column({ nullable: true, type: 'varchar' })
  letterPath: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Application, (application) => application.decisions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @OneToOne(() => Certificate, (certificate) => certificate.decision)
  certificate: Certificate | null;
}

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column({ type: 'varchar',  unique: true })
  decisionId: string;

  @Column({ type: 'varchar',  unique: true })
  certificateNumber: string;

  @Column({ type: 'varchar',  unique: true })
  verificationToken: string;

  @Column({ nullable: true, type: 'varchar' })
  pdfPath: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issuedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date | null;

  @ManyToOne(() => Application, (application) => application.certificates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @OneToOne(() => Decision, (decision) => decision.certificate)
  @JoinColumn({ name: 'decisionId' })
  decision: Decision;
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column({ type: 'numeric' })
  amount: string;

  @Column({ type: 'varchar',  default: 'KES' })
  currency: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  dueDate: Date | null;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.invoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceId: string;

  @Column({ type: 'numeric' })
  amount: string;

  @Column({ nullable: true, type: 'varchar' })
  method: string | null;

  @Column({ nullable: true, type: 'varchar' })
  referenceNumber: string | null;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true, type: 'varchar' })
  verifiedById: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  verifiedAt: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @OneToMany(() => Receipt, (receipt) => receipt.payment)
  receipts: Receipt[];
}

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentId: string;

  @Column({ type: 'varchar',  unique: true })
  receiptNumber: string;

  @Column({ type: 'numeric' })
  amount: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issuedAt: Date;

  @Column({ nullable: true, type: 'varchar' })
  pdfPath: string | null;

  @ManyToOne(() => Payment, (payment) => payment.receipts)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;
}

@Entity('amendments')
export class Amendment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  reason: string;

  @Column({
    type: 'enum',
    enum: MonitoringStatus,
    enumName: 'MonitoringStatus',
    default: MonitoringStatus.DRAFT,
  })
  status: MonitoringStatus;

  @Column({ nullable: true, type: 'timestamp' })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.amendments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('renewals')
export class Renewal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column({ nullable: true, type: 'varchar' })
  extensionPeriod: string | null;

  @Column()
  justification: string;

  @Column({
    type: 'enum',
    enum: MonitoringStatus,
    enumName: 'MonitoringStatus',
    default: MonitoringStatus.DRAFT,
  })
  status: MonitoringStatus;

  @Column({ nullable: true, type: 'timestamp' })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.renewals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('progress_reports')
export class ProgressReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  reportPeriod: string;

  @Column()
  summary: string;

  @Column({ nullable: true, type: 'int' })
  participantsEnrolled: number | null;

  @Column({ nullable: true, type: 'varchar' })
  findings: string | null;

  @Column({
    type: 'enum',
    enum: MonitoringStatus,
    enumName: 'MonitoringStatus',
    default: MonitoringStatus.DRAFT,
  })
  status: MonitoringStatus;

  @Column({ nullable: true, type: 'timestamp' })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.progressReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('adverse_events')
export class AdverseEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  eventDate: Date;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: SeverityLevel,
    enumName: 'SeverityLevel',
  })
  severity: SeverityLevel;

  @Column({ nullable: true, type: 'int' })
  affectedParticipants: number | null;

  @Column({ nullable: true, type: 'varchar' })
  actionTaken: string | null;

  @Column({
    type: 'enum',
    enum: MonitoringStatus,
    enumName: 'MonitoringStatus',
    default: MonitoringStatus.DRAFT,
  })
  status: MonitoringStatus;

  @Column({ nullable: true, type: 'timestamp' })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.adverseEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('protocol_deviations')
export class ProtocolDeviation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  deviationDate: Date;

  @Column()
  description: string;

  @Column({ nullable: true, type: 'varchar' })
  impact: string | null;

  @Column({ nullable: true, type: 'varchar' })
  correctiveAction: string | null;

  @Column({
    type: 'enum',
    enum: MonitoringStatus,
    enumName: 'MonitoringStatus',
    default: MonitoringStatus.DRAFT,
  })
  status: MonitoringStatus;

  @Column({ nullable: true, type: 'timestamp' })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => Application,
    (application) => application.protocolDeviations,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('closure_reports')
export class ClosureReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @Column()
  closureDate: Date;

  @Column()
  description: string;

  @Column({ nullable: true, type: 'int' })
  totalEnrolled: number | null;

  @Column({ nullable: true, type: 'varchar' })
  findings: string | null;

  @Column({
    type: 'enum',
    enum: MonitoringStatus,
    enumName: 'MonitoringStatus',
    default: MonitoringStatus.DRAFT,
  })
  status: MonitoringStatus;

  @Column({ nullable: true, type: 'timestamp' })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.closureReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    enumName: 'NotificationType',
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'boolean',  default: false })
  isRead: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  actorId: string | null;

  @Column()
  action: string;

  @Column()
  targetEntity: string;

  @Column()
  targetId: string;

  @Column({ nullable: true, type: 'varchar' })
  tenantId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({ nullable: true, type: 'varchar' })
  ipAddress: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
  @JoinColumn({ name: 'actorId' })
  actor: User | null;

  @ManyToOne(() => Tenant, (tenant) => tenant.auditLogs, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant | null;
}

export const databaseEntities = [
  Tenant,
  Role,
  Permission,
  RolePermission,
  User,
  ApplicantProfile,
  Institution,
  Application,
  ApplicationDocument,
  WorkflowTransition,
  ReviewAssignment,
  Review,
  Query,
  QueryResponse,
  Decision,
  Certificate,
  Invoice,
  Payment,
  Receipt,
  Amendment,
  Renewal,
  ProgressReport,
  AdverseEvent,
  ProtocolDeviation,
  ClosureReport,
  Notification,
  AuditLog,
];
