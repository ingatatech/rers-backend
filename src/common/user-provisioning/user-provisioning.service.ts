import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { EmailService } from '../email/email.service';

const SALT_ROUNDS = 10;

export interface ProvisionUserInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  roleId: string;
  tenantId?: string | null;
}

@Injectable()
export class UserProvisioningService {
  private readonly logger = new Logger(UserProvisioningService.name);

  constructor(
    private readonly database: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  private generatePassword(): string {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnpqrstuvwxyz';
    const digits = '23456789';
    const special = '!@#$%';
    const all = upper + lower + digits + special;

    const required = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      special[Math.floor(Math.random() * special.length)],
    ];

    const rest = Array.from({ length: 8 }, () => all[Math.floor(Math.random() * all.length)]);

    return [...required, ...rest]
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  async provision(input: ProvisionUserInput) {
    const plainPassword = this.generatePassword();
    const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    const user = await this.database.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
        roleId: input.roleId,
        tenantId: input.tenantId ?? null,
        isActive: true,
        isVerified: true,
        firstLogin: true,
      },
    });

    this.emailService
      .sendWelcomeCredentials(input.email, input.firstName, input.email, plainPassword)
      .catch((err) =>
        this.logger.error(`Failed to send welcome email to ${input.email}`, err),
      );

    return user;
  }
}
