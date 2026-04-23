import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

@Injectable()
export class NotificationsService {
  constructor(private readonly database: DatabaseService) {}

  // ─── create ──────────────────────────────────────────────────────────────────

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.database.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        metadata: metadata ?? undefined,
      },
    });
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(userId: string, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [notifications, total] = await this.database.$transaction([
      this.database.notification.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.database.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ─── markRead ────────────────────────────────────────────────────────────────

  async markRead(id: string, userId: string) {
    const notification = await this.database.notification.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!notification) {
      throw new NotFoundException(`Notification "${id}" not found.`);
    }

    if (notification.userId !== userId) {
      throw new NotFoundException(`Notification "${id}" not found.`);
    }

    return this.database.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  // ─── markAllRead ─────────────────────────────────────────────────────────────

  async markAllRead(userId: string) {
    return this.database.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // ─── getUnreadCount ───────────────────────────────────────────────────────────

  async getUnreadCount(userId: string) {
    const count = await this.database.notification.count({
      where: { userId, isRead: false },
    });

    return { count };
  }

  // ─── send (static helper) ─────────────────────────────────────────────────────

  static async send(
    database: DatabaseService,
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    return database.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        metadata: metadata ?? undefined,
      },
    });
  }
}
