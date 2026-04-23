import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../common/database/database.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { BootstrapDto } from './dto/bootstrap.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class BootstrapService {
  constructor(private readonly database: DatabaseService) {}

  async seed(dto: BootstrapDto) {
    const existingAdmin = await this.database.user.findFirst({
      where: { role: { name: UserRole.SYSTEM_ADMIN } },
    });

    if (existingAdmin) {
      throw new ConflictException(
        'System has already been bootstrapped. This endpoint is disabled.',
      );
    }

    // Seed all roles
    const seededRoles: string[] = [];
    for (const roleName of Object.values(UserRole)) {
      const exists = await this.database.role.findUnique({
        where: { name: roleName },
      });
      if (!exists) {
        await this.database.role.create({ data: { name: roleName } });
        seededRoles.push(roleName);
      }
    }

    // Create the system admin
    const adminRole = await this.database.role.findUnique({
      where: { name: UserRole.SYSTEM_ADMIN },
    });

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    await this.database.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: 'System',
        lastName: 'Admin',
        isActive: true,
        isVerified: true,
        roleId: adminRole.id,
      },
    });

    return {
      message: 'Bootstrap complete.',
      rolesSeeded: seededRoles.length > 0 ? seededRoles : 'all roles already existed',
      adminCreated: dto.email,
    };
  }
}
