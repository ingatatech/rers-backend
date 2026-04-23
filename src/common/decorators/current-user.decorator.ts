import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * Shape of the JWT payload attached to each authenticated request by
 * JwtStrategy.validate().
 */
export interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
  iat?: number;
  exp?: number;
}

/**
 * Parameter decorator that extracts the authenticated user from the request.
 *
 * Usage:
 *   @CurrentUser() user: JwtPayload
 *   @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;

    return field ? user?.[field] : user;
  },
);
