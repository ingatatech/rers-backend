import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

interface RawJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: RawJwtPayload): JwtPayload {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token payload.');
    }

    return {
      sub: payload.sub,
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId ?? null,
    };
  }
}
