import {
  DeepPartial,
  LessThan,
  MoreThan,
  ObjectLiteral,
  QueryDeepPartialEntity,
  Repository,
  FindOptionsWhere,
  ILike,
} from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { QueryOptions } from './base.types';

@Injectable()
export class BaseService<T extends ObjectLiteral> {
  protected readonly logger = new Logger(BaseService.name);

  constructor(
    protected readonly repo: Repository<T>,
    protected readonly searchableFields: (keyof T)[] = [],
    public readonly entityName: string = 'Entity',
  ) {}

  async create(data: DeepPartial<T>): Promise<T> {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException(
        `Create payload cannot be empty for ${this.entityName}`,
      );
    }

    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);

    this.logger.log(
      `Created new ${this.entityName} with ID ${(saved as any).id}`,
    );

    return saved;
  }

  async findAll(): Promise<T[]> {
    return this.repo.find();
  }
  async findAllAdvanced(options?: QueryOptions<T>) {
    const {
      limit = 10,
      search,
      filters = {} as Partial<T>,
      lastId,
      sortBy = 'id' as keyof T,
      sortOrder = 'ASC',
    } = options || {};

    const whereClauses: FindOptionsWhere<T>[] = [];

    if (search && this.searchableFields?.length) {
      for (const field of this.searchableFields) {
        whereClauses.push({
          ...filters,
          [field]: ILike(`%${search}%`),
        } as FindOptionsWhere<T>);
      }
    } else {
      whereClauses.push(filters as FindOptionsWhere<T>);
    }

    if (lastId) {
      for (const where of whereClauses) {
        if (sortOrder === 'ASC') {
          (where as any)[sortBy] = MoreThan(lastId);
        } else {
          (where as any)[sortBy] = LessThan(lastId);
        }
      }
    }

    const data = await this.repo.find({
      where: whereClauses,
      take: limit,
      order: { [sortBy]: sortOrder } as any,
    });

    const lastItem = data.length
      ? (data[data.length - 1] as any)[sortBy]
      : null;

    return {
      data,
      limit,
      nextCursor: lastItem ?? null,
      hasMore: data.length === limit,
    };
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repo.findOneBy({ id } as any);

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return entity;
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid ID');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException(
        `Update payload cannot be empty for ${this.entityName}`,
      );
    }

    const result = await this.repo.update(id, data);

    if (result.affected === 0) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    this.logger.log(`Updated ${this.entityName} with ID ${id}`);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    this.logger.log(`Deleted ${this.entityName} with ID ${id}`);
    return true;
  }
}
