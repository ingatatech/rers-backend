import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../decorators/current-user.decorator';

/**
 * Authorization guard that enforces role-based access control.
 *
 * Works in tandem with the @Roles() decorator. If no roles are specified on a
 * handler, access is granted. Otherwise the authenticated user's role must be
 * included in the allowed roles list.
 *
 * Register globally in AppModule providers after JwtAuthGuard:
 *   { provide: APP_GUARD, useClass: RolesGuard }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Authentication is required to access this resource.',
      );
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required role(s): ${requiredRoles.join(', ')}.`,
      );
    }

    return true;
  }
}
