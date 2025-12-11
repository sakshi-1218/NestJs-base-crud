import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ObjectLiteral, DeepPartial, QueryDeepPartialEntity } from 'typeorm';
import { BaseService } from './base.service';
import type { QueryOptions } from './base.types';

export abstract class BaseController<
  T extends ObjectLiteral,
  CreateDto extends DeepPartial<T> = DeepPartial<T>,
  UpdateDto extends QueryDeepPartialEntity<T> = QueryDeepPartialEntity<T>,
> {
  constructor(protected readonly service: BaseService<T>) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateDto) {
    try {
      if (!body || Object.keys(body).length === 0) {
        throw new BadRequestException('Request body cannot be empty');
      }
      const data = await this.service.create(body);
      return {
        message: `${this.service.entityName} created successfully`,
        data,
      };
    } catch (error) {
      console.error(`Error creating ${this.service.entityName}:`, error);
      throw new InternalServerErrorException(
        `Failed to create ${this.service.entityName}`,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryOptions<T>) {
    try {
      const result = await this.service.findAllAdvanced(query);
      return {
        message: `${this.service.entityName}s fetched successfully`,
        ...result,
      };
    } catch (error) {
      console.error(`Error fetching ${this.service.entityName}s:`, error);
      throw new InternalServerErrorException(
        `Failed to fetch ${this.service.entityName}s`,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    try {
      const data = await this.service.findOne(Number(id));
      if (!data)
        throw new NotFoundException(
          `${this.service.entityName} with ID ${id} not found`,
        );
      return {
        message: `${this.service.entityName} fetched successfully`,
        data,
      };
    } catch (error) {
      console.error(
        `Error fetching ${this.service.entityName} with ID ${id}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to fetch ${this.service.entityName}`,
      );
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() body: UpdateDto) {
    try {
      if (!body || Object.keys(body).length === 0) {
        throw new BadRequestException('Update payload cannot be empty');
      }
      const data = await this.service.update(Number(id), body);
      return {
        message: `${this.service.entityName} updated successfully`,
        data,
      };
    } catch (error) {
      console.error(
        `Error updating ${this.service.entityName} with ID ${id}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to update ${this.service.entityName}`,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    try {
      const result = await this.service.remove(Number(id));
      return { message: result.message };
    } catch (error) {
      console.error(
        `Error deleting ${this.service.entityName} with ID ${id}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to delete ${this.service.entityName}`,
      );
    }
  }
}
