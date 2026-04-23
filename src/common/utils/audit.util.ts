import { DatabaseService } from '../database/database.service';

/**
 * Parameters accepted by createAuditLog().
 */
export interface CreateAuditLogParams {
  /** ID of the user who performed the action (null for system actions) */
  actorId?: string | null;
  /** Human-readable action label, e.g. "APPLICATION_SUBMITTED" */
  action: string;
  /** Human-readable entity name, e.g. "Application" */
  targetEntity: string;
  /** Primary-key value of the affected record */
  targetId: string;
  /** Tenant context (if applicable) */
  tenantId?: string | null;
  /** Additional structured context to store alongside the log entry */
  metadata?: Record<string, unknown>;
  /** Client IP address extracted from the request */
  ipAddress?: string | null;
}

/**
 * Persists an audit log entry to the database.
 *
 * Call this helper from service methods whenever a significant state change
 * occurs (submissions, decisions, payments, etc.).
 *
 * @example
 * await createAuditLog(this.database, {
 *   actorId: user.id,
 *   action: 'APPLICATION_SUBMITTED',
 *   targetEntity: 'Application',
 *   targetId: application.id,
 *   tenantId: application.tenantId,
 *   metadata: { referenceNumber: application.referenceNumber },
 *   ipAddress: req.ip,
 * });
 */
export async function createAuditLog(
  database: DatabaseService,
  params: CreateAuditLogParams,
): Promise<void> {
  try {
    await database.auditLog.create({
      data: {
        actorId: params.actorId ?? null,
        action: params.action,
        targetEntity: params.targetEntity,
        targetId: params.targetId,
        tenantId: params.tenantId ?? null,
        metadata: params.metadata ?? {},
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (error) {
    // Audit failures must never interrupt the primary operation — log and
    // continue rather than propagating the error.
    console.error('[AuditLog] Failed to persist audit log entry', {
      action: params.action,
      targetEntity: params.targetEntity,
      targetId: params.targetId,
      error,
    });
  }
}
