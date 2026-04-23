import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as publicly accessible — bypasses the global JwtAuthGuard.
 *
 * Usage:
 *   @Public()
 *   @Post('login')
 *   login(@Body() dto: LoginDto) { ... }
 */
export const Public = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(IS_PUBLIC_KEY, true);
