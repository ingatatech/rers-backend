/**
 * UserRole enum shared across DTOs, guards, decorators, and database models.
 */
export enum UserRole {
  APPLICANT = 'APPLICANT',
  REVIEWER = 'REVIEWER',
  IRB_ADMIN = 'IRB_ADMIN',
  RNEC_ADMIN = 'RNEC_ADMIN',
  FINANCE_OFFICER = 'FINANCE_OFFICER',
  CHAIRPERSON = 'CHAIRPERSON',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}
