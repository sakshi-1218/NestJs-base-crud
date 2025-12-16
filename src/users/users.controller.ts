import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PurchaseItemDto } from './dto/purchase-item.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController<User> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Post(':id/purchase')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Purchase an item for a specific user' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async purchaseItem(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: PurchaseItemDto,
  ) {
    const result = await this.usersService.purchaseItem(
      userId,
      dto.itemName,
      dto.quantity,
    );

    return result;
  }

  @Get(':id/purchases')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all purchases made by a specific user' })
  @ApiParam({ name: 'id', type: Number })
  async getUserPurchases(@Param('id', ParseIntPipe) userId: number) {
    const purchases = await this.usersService.getUserPurchases(userId);
    return purchases;
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a user account' })
  @ApiParam({ name: 'id', type: Number })
  async activateUser(@Param('id') userId: number) {
    const user = await this.usersService.activateUser(userId);
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(id, dto);
    return updatedUser;
  }
}
