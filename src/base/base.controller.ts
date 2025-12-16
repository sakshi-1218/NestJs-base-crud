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
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }

    const data = await this.service.create(body);

    return data;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryOptions<T>) {
    const result = await this.service.findAllAdvanced(query);

    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(Number(id));

   return data;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() body: UpdateDto) {
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('Update payload cannot be empty');
    }

    const data = await this.service.update(Number(id), body);

    return data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    const result = await this.service.remove(Number(id));

    return result;
  }
}
