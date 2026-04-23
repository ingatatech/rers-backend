import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to users with one or more of the specified roles.
 *
 * Usage:
 *   @Roles(UserRole.SYSTEM_ADMIN, UserRole.RNEC_ADMIN)
 *   @Get('admin-only')
 *   adminOnly() { ... }
 */
export const Roles = (...roles: UserRole[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(ROLES_KEY, roles);
