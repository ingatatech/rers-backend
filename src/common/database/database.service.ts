import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  Between,
  DataSource,
  EntityMetadata,
  EntityTarget,
  FindOperator,
  ILike,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  AdverseEvent,
  Amendment,
  ApplicantProfile,
  Application,
  ApplicationDocument,
  AuditLog,
  Certificate,
  ClosureReport,
  Decision,
  Institution,
  Invoice,
  Notification,
  Payment,
  Permission,
  ProgressReport,
  ProtocolDeviation,
  Query,
  QueryResponse,
  Receipt,
  Renewal,
  Review,
  ReviewAssignment,
  Role,
  RolePermission,
  Tenant,
  User,
  WorkflowTransition,
} from '../../database/models';

type DatabaseRecord = Record<string, any>;

interface DatabaseQueryOptions {
  include?: DatabaseRecord;
  orderBy?: DatabaseRecord;
  select?: DatabaseRecord;
  skip?: number;
  take?: number;
  where?: DatabaseRecord;
}

interface DatabaseCreateOptions extends DatabaseQueryOptions {
  data: DatabaseRecord;
}

interface DatabaseUpdateOptions extends DatabaseCreateOptions {
  where: DatabaseRecord;
}

interface DatabaseDeleteOptions {
  where: DatabaseRecord;
}

interface DatabaseGroupByOptions {
  by: string[];
  where?: DatabaseRecord;
  _count?: DatabaseRecord;
}

const OPERATOR_KEYS = new Set([
  'contains',
  'startsWith',
  'in',
  'gte',
  'lte',
  'not',
  'mode',
]);

function isPlainObject(value: unknown): value is DatabaseRecord {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function uniquePathsToRelations(paths: Set<string>): DatabaseRecord | undefined {
  if (paths.size === 0) {
    return undefined;
  }

  const relations: DatabaseRecord = {};

  for (const path of paths) {
    const segments = path.split('.');
    let cursor = relations;

    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index];
      const isLeaf = index === segments.length - 1;

      if (isLeaf) {
        cursor[segment] = true;
        continue;
      }

      cursor[segment] = cursor[segment] && cursor[segment] !== true ? cursor[segment] : {};
      cursor = cursor[segment];
    }
  }

  return relations;
}

class ModelAdapter {
  constructor(
    private readonly dataSource: DataSource,
    private readonly entity: EntityTarget<any>,
  ) {}

  private get repository(): Repository<any> {
    return this.dataSource.getRepository(this.entity);
  }

  async findUnique(options: DatabaseQueryOptions): Promise<any | null> {
    const records = await this.repository.find({
      where: this.buildWhere(options.where),
      relations: this.buildRelations(options),
      take: 1,
    });

    if (records.length === 0) {
      return null;
    }

    return this.transform(records[0], options);
  }

  async findFirst(options: DatabaseQueryOptions): Promise<any | null> {
    const records = await this.repository.find({
      where: this.buildWhere(options.where),
      relations: this.buildRelations(options),
      order: this.buildOrder(options.orderBy),
      take: 1,
    });

    if (records.length === 0) {
      return null;
    }

    return this.transform(records[0], options);
  }

  async findMany(options: DatabaseQueryOptions = {}): Promise<any[]> {
    const records = await this.repository.find({
      where: this.buildWhere(options.where),
      relations: this.buildRelations(options),
      order: this.buildOrder(options.orderBy),
      skip: options.skip,
      take: options.take,
    });

    return records.map((record) => this.transform(record, options));
  }

  async count(options: DatabaseQueryOptions = {}): Promise<number> {
    return this.repository.count({
      where: this.buildWhere(options.where),
    });
  }

  async create(options: DatabaseCreateOptions): Promise<any> {
    const payload = this.cleanData(options.data);
    const entity = this.repository.create(payload);
    const saved = await this.repository.save(entity);

    if (!options.include && !options.select) {
      return this.transform(saved, {});
    }

    return this.reload(saved, options);
  }

  async update(options: DatabaseUpdateOptions): Promise<any> {
    const current = await this.repository.findOne({
      where: this.buildWhere(options.where),
    });

    if (!current) {
      return null;
    }

    const updated = this.repository.merge(current, this.cleanData(options.data));
    const saved = await this.repository.save(updated);

    if (!options.include && !options.select) {
      return this.transform(saved, {});
    }

    return this.reload(saved, options);
  }

  async delete(options: DatabaseDeleteOptions): Promise<any | null> {
    const current = await this.repository.findOne({
      where: this.buildWhere(options.where),
    });

    if (!current) {
      return null;
    }

    await this.repository.remove(current);
    return this.transform(current, {});
  }

  async deleteMany(options: DatabaseDeleteOptions): Promise<{ count: number }> {
    const where = this.buildWhere(options.where);
    const result = await this.repository.delete(where ?? {});
    return { count: result.affected ?? 0 };
  }

  async updateMany(options: DatabaseUpdateOptions): Promise<{ count: number }> {
    const records = await this.repository.find({
      where: this.buildWhere(options.where),
    });

    if (records.length === 0) {
      return { count: 0 };
    }

    const nextRecords = records.map((record) =>
      this.repository.merge(record, this.cleanData(options.data)),
    );

    await this.repository.save(nextRecords);

    return { count: records.length };
  }

  async groupBy(options: DatabaseGroupByOptions): Promise<any[]> {
    const records = await this.repository.find({
      where: this.buildWhere(options.where),
      relations: this.buildWhereRelations(options.where),
    });

    const groups = new Map<string, DatabaseRecord>();

    for (const record of records) {
      const keyValues = options.by.map((field) => record[field]);
      const groupKey = JSON.stringify(keyValues);

      if (!groups.has(groupKey)) {
        const baseGroup: DatabaseRecord = {};
        for (let index = 0; index < options.by.length; index += 1) {
          baseGroup[options.by[index]] = keyValues[index];
        }

        baseGroup._count = {};
        groups.set(groupKey, baseGroup);
      }

      const group = groups.get(groupKey)!;
      const countKeys = Object.keys(options._count ?? {});

      if (countKeys.length === 0) {
        group._count._all = (group._count._all ?? 0) + 1;
        continue;
      }

      for (const countKey of countKeys) {
        group._count[countKey] = (group._count[countKey] ?? 0) + 1;
      }
    }

    return Array.from(groups.values());
  }

  private async reload(record: DatabaseRecord, options: DatabaseQueryOptions) {
    return this.findUnique({
      where: this.getPrimaryWhere(record),
      include: options.include,
      select: options.select,
    });
  }

  private getPrimaryWhere(record: DatabaseRecord): DatabaseRecord {
    const where: DatabaseRecord = {};

    for (const primaryColumn of this.repository.metadata.primaryColumns) {
      where[primaryColumn.propertyName] = record[primaryColumn.propertyName];
    }

    return where;
  }

  private buildWhere(where?: DatabaseRecord, metadata?: EntityMetadata): DatabaseRecord | undefined {
    if (!where) {
      return undefined;
    }

    const entityMetadata = metadata ?? this.repository.metadata;
    const builtWhere: DatabaseRecord = {};

    for (const [key, rawValue] of Object.entries(where)) {
      if (rawValue === undefined) {
        continue;
      }

      if (key === 'OR' && Array.isArray(rawValue)) {
        return rawValue.map((entry) => this.buildWhere(entry, entityMetadata));
      }

      if (isPlainObject(rawValue) && !this.isOperatorObject(rawValue)) {
        const relation = entityMetadata.findRelationWithPropertyPath(key);

        if (relation) {
          builtWhere[key] = this.buildWhere(rawValue, relation.inverseEntityMetadata);
          continue;
        }

        Object.assign(builtWhere, this.buildWhere(rawValue, entityMetadata));
        continue;
      }

      builtWhere[key] = this.toOperator(rawValue);
    }

    return builtWhere;
  }

  private buildWhereRelations(where?: DatabaseRecord): DatabaseRecord | undefined {
    const relationPaths = new Set<string>();
    this.collectWhereRelationPaths(where, this.repository.metadata, '', relationPaths);
    return uniquePathsToRelations(relationPaths);
  }

  private collectWhereRelationPaths(
    where: DatabaseRecord | undefined,
    metadata: EntityMetadata,
    prefix: string,
    relationPaths: Set<string>,
  ) {
    if (!where) {
      return;
    }

    for (const [key, value] of Object.entries(where)) {
      if (!isPlainObject(value) || this.isOperatorObject(value)) {
        continue;
      }

      const relation = metadata.findRelationWithPropertyPath(key);

      if (!relation) {
        continue;
      }

      const path = prefix ? `${prefix}.${key}` : key;
      relationPaths.add(path);
      this.collectWhereRelationPaths(
        value,
        relation.inverseEntityMetadata,
        path,
        relationPaths,
      );
    }
  }

  private buildRelations(options: DatabaseQueryOptions): DatabaseRecord | undefined {
    const relationPaths = new Set<string>();

    this.collectSelectionRelationPaths(
      options.include,
      this.repository.metadata,
      '',
      relationPaths,
    );
    this.collectSelectionRelationPaths(
      options.select,
      this.repository.metadata,
      '',
      relationPaths,
    );
    this.collectWhereRelationPaths(
      options.where,
      this.repository.metadata,
      '',
      relationPaths,
    );

    return uniquePathsToRelations(relationPaths);
  }

  private collectSelectionRelationPaths(
    selection: DatabaseRecord | undefined,
    metadata: EntityMetadata,
    prefix: string,
    relationPaths: Set<string>,
  ) {
    if (!selection) {
      return;
    }

    for (const [key, value] of Object.entries(selection)) {
      if (key === '_count' && isPlainObject(value) && isPlainObject(value.select)) {
        for (const [relationName, enabled] of Object.entries(value.select)) {
          if (!enabled) {
            continue;
          }

          const relation = metadata.findRelationWithPropertyPath(relationName);
          if (!relation) {
            continue;
          }

          const path = prefix ? `${prefix}.${relationName}` : relationName;
          relationPaths.add(path);
        }
        continue;
      }

      const relation = metadata.findRelationWithPropertyPath(key);
      if (!relation) {
        continue;
      }

      const path = prefix ? `${prefix}.${key}` : key;
      relationPaths.add(path);

      if (!isPlainObject(value)) {
        continue;
      }

      const nestedSelection = isPlainObject(value.select)
        ? value.select
        : isPlainObject(value.include)
          ? value.include
          : value;

      this.collectSelectionRelationPaths(
        nestedSelection,
        relation.inverseEntityMetadata,
        path,
        relationPaths,
      );
    }
  }

  private buildOrder(orderBy?: DatabaseRecord): DatabaseRecord | undefined {
    if (!orderBy) {
      return undefined;
    }

    const builtOrder: DatabaseRecord = {};

    for (const [key, value] of Object.entries(orderBy)) {
      builtOrder[key] = String(value).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    return builtOrder;
  }

  private isOperatorObject(value: DatabaseRecord): boolean {
    return Object.keys(value).some((key) => OPERATOR_KEYS.has(key));
  }

  private toOperator(value: any): any {
    if (!isPlainObject(value)) {
      return value;
    }

    if (value.contains !== undefined) {
      return value.mode === 'insensitive'
        ? ILike(`%${value.contains}%`)
        : Like(`%${value.contains}%`);
    }

    if (value.startsWith !== undefined) {
      return value.mode === 'insensitive'
        ? ILike(`${value.startsWith}%`)
        : Like(`${value.startsWith}%`);
    }

    if (Array.isArray(value.in)) {
      return In(value.in);
    }

    if (value.gte !== undefined && value.lte !== undefined) {
      return Between(value.gte, value.lte);
    }

    if (value.gte !== undefined) {
      return MoreThanOrEqual(value.gte);
    }

    if (value.lte !== undefined) {
      return LessThanOrEqual(value.lte);
    }

    if (value.not !== undefined) {
      return Not(this.toOperator(value.not));
    }

    return value;
  }

  private cleanData(value: any): any {
    if (Array.isArray(value)) {
      return value.map((entry) => this.cleanData(entry));
    }

    if (!isPlainObject(value)) {
      return value;
    }

    const cleaned: DatabaseRecord = {};

    for (const [key, entry] of Object.entries(value)) {
      if (entry === undefined) {
        continue;
      }

      cleaned[key] = this.cleanData(entry);
    }

    return cleaned;
  }

  private transform(record: DatabaseRecord, options: DatabaseQueryOptions): any {
    if (options.select) {
      return this.transformWithSelect(record, this.repository.metadata, options.select);
    }

    if (options.include) {
      return this.transformWithInclude(record, this.repository.metadata, options.include);
    }

    return this.scalarSnapshot(record, this.repository.metadata);
  }

  private transformWithSelect(
    record: DatabaseRecord,
    metadata: EntityMetadata,
    select: DatabaseRecord,
  ): DatabaseRecord {
    const transformed: DatabaseRecord = {};

    for (const [key, value] of Object.entries(select)) {
      if (!value) {
        continue;
      }

      if (key === '_count' && isPlainObject(value) && isPlainObject(value.select)) {
        transformed._count = this.buildRelationCounts(record, metadata, value.select);
        continue;
      }

      const relation = metadata.findRelationWithPropertyPath(key);
      if (!relation) {
        transformed[key] = record[key];
        continue;
      }

      transformed[key] = this.transformRelationValue(
        record[key],
        relation.inverseEntityMetadata,
        value === true ? undefined : value,
      );
    }

    return transformed;
  }

  private transformWithInclude(
    record: DatabaseRecord,
    metadata: EntityMetadata,
    include: DatabaseRecord,
  ): DatabaseRecord {
    const transformed = this.scalarSnapshot(record, metadata);

    for (const [key, value] of Object.entries(include)) {
      if (!value) {
        continue;
      }

      if (key === '_count' && isPlainObject(value) && isPlainObject(value.select)) {
        transformed._count = this.buildRelationCounts(record, metadata, value.select);
        continue;
      }

      const relation = metadata.findRelationWithPropertyPath(key);
      if (!relation) {
        continue;
      }

      transformed[key] = this.transformRelationValue(
        record[key],
        relation.inverseEntityMetadata,
        value === true ? undefined : value,
      );
    }

    return transformed;
  }

  private transformRelationValue(
    value: any,
    metadata: EntityMetadata,
    options?: DatabaseRecord,
  ): any {
    if (Array.isArray(value)) {
      const sorted = this.sortArray(value, options?.orderBy);
      return sorted.map((entry) => {
        if (options?.select) {
          return this.transformWithSelect(entry, metadata, options.select);
        }

        if (options?.include) {
          return this.transformWithInclude(entry, metadata, options.include);
        }

        return this.scalarSnapshot(entry, metadata);
      });
    }

    if (value === null || value === undefined) {
      return value;
    }

    if (options?.select) {
      return this.transformWithSelect(value, metadata, options.select);
    }

    if (options?.include) {
      return this.transformWithInclude(value, metadata, options.include);
    }

    return this.scalarSnapshot(value, metadata);
  }

  private sortArray(items: DatabaseRecord[], orderBy?: DatabaseRecord): DatabaseRecord[] {
    if (!orderBy) {
      return items;
    }

    const [[field, direction]] = Object.entries(orderBy);
    const multiplier = String(direction).toLowerCase() === 'asc' ? 1 : -1;

    return [...items].sort((left, right) => {
      const leftValue = left[field];
      const rightValue = right[field];

      if (leftValue === rightValue) {
        return 0;
      }

      return leftValue > rightValue ? multiplier : -multiplier;
    });
  }

  private buildRelationCounts(
    record: DatabaseRecord,
    metadata: EntityMetadata,
    countSelect: DatabaseRecord,
  ): DatabaseRecord {
    const counts: DatabaseRecord = {};

    for (const relationName of Object.keys(countSelect)) {
      const relation = metadata.findRelationWithPropertyPath(relationName);

      if (!relation) {
        continue;
      }

      const relationValue = record[relationName];

      if (Array.isArray(relationValue)) {
        counts[relationName] = relationValue.length;
        continue;
      }

      counts[relationName] = relationValue ? 1 : 0;
    }

    return counts;
  }

  private scalarSnapshot(record: DatabaseRecord, metadata: EntityMetadata): DatabaseRecord {
    const snapshot: DatabaseRecord = {};

    for (const column of metadata.columns) {
      snapshot[column.propertyName] = record[column.propertyName];
    }

    return snapshot;
  }
}

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly adverseEvent: ModelAdapter;
  readonly amendment: ModelAdapter;
  readonly applicantProfile: ModelAdapter;
  readonly application: ModelAdapter;
  readonly applicationDocument: ModelAdapter;
  readonly auditLog: ModelAdapter;
  readonly certificate: ModelAdapter;
  readonly closureReport: ModelAdapter;
  readonly decision: ModelAdapter;
  readonly institution: ModelAdapter;
  readonly invoice: ModelAdapter;
  readonly notification: ModelAdapter;
  readonly payment: ModelAdapter;
  readonly permission: ModelAdapter;
  readonly progressReport: ModelAdapter;
  readonly protocolDeviation: ModelAdapter;
  readonly query: ModelAdapter;
  readonly queryResponse: ModelAdapter;
  readonly receipt: ModelAdapter;
  readonly renewal: ModelAdapter;
  readonly review: ModelAdapter;
  readonly reviewAssignment: ModelAdapter;
  readonly role: ModelAdapter;
  readonly rolePermission: ModelAdapter;
  readonly tenant: ModelAdapter;
  readonly user: ModelAdapter;
  readonly workflowTransition: ModelAdapter;

  constructor(private readonly dataSource: DataSource) {
    this.adverseEvent = this.createModel(AdverseEvent);
    this.amendment = this.createModel(Amendment);
    this.applicantProfile = this.createModel(ApplicantProfile);
    this.application = this.createModel(Application);
    this.applicationDocument = this.createModel(ApplicationDocument);
    this.auditLog = this.createModel(AuditLog);
    this.certificate = this.createModel(Certificate);
    this.closureReport = this.createModel(ClosureReport);
    this.decision = this.createModel(Decision);
    this.institution = this.createModel(Institution);
    this.invoice = this.createModel(Invoice);
    this.notification = this.createModel(Notification);
    this.payment = this.createModel(Payment);
    this.permission = this.createModel(Permission);
    this.progressReport = this.createModel(ProgressReport);
    this.protocolDeviation = this.createModel(ProtocolDeviation);
    this.query = this.createModel(Query);
    this.queryResponse = this.createModel(QueryResponse);
    this.receipt = this.createModel(Receipt);
    this.renewal = this.createModel(Renewal);
    this.review = this.createModel(Review);
    this.reviewAssignment = this.createModel(ReviewAssignment);
    this.role = this.createModel(Role);
    this.rolePermission = this.createModel(RolePermission);
    this.tenant = this.createModel(Tenant);
    this.user = this.createModel(User);
    this.workflowTransition = this.createModel(WorkflowTransition);
  }

  async $transaction<T extends readonly unknown[]>(
    operations: { [K in keyof T]: Promise<T[K]> },
  ): Promise<T> {
    return Promise.all(operations) as Promise<T>;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  private createModel(entity: EntityTarget<any>): ModelAdapter {
    return new ModelAdapter(this.dataSource, entity);
  }
}
