import {
  Controller,
  UsePipes,
  Post,
  Put,
  Get,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PurchaseItemDto } from './dto/purchase-item.dto';

import { UpdateUserDto
 } from './dto/update-user.dto';
 import { ValidatePurchasePipe } from 'src/common/pipes/validate-purchase.pipe';


import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController<User> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email or existing user' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() dto: CreateUserDto) {
    try {
      if (!dto.email || !dto.email.includes('@')) {
        throw new BadRequestException('Invalid email address');
      }

      const existing = await this.usersService.findByEmail(dto.email);
      if (existing) {
        throw new BadRequestException('Email already registered');
      }

      const data = await this.usersService.create(dto);
      return {
        message: 'User created successfully',
        data,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

 @Post(':id/purchase')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Purchase an item for a specific user' })
@ApiParam({ name: 'id', type: Number, description: 'User ID' })
@ApiResponse({ status: 201, description: 'Purchase completed successfully' })
@ApiResponse({ status: 400, description: 'Invalid request body' })
@ApiResponse({ status: 404, description: 'User not found' })
@ApiResponse({ status: 500, description: 'Failed to complete purchase' })
async purchaseItem(
  @Param('id', ParseIntPipe) userId: number, 
  @Body(new ValidatePurchasePipe()) body: PurchaseItemDto, 
) {
  const result = await this.usersService.purchaseItem(
    userId,
    body.itemName,
    body.quantity,
  );

  return {
    message: 'Purchase completed successfully',
    data: result,
  };
}




 @Get(':id/purchases')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Fetch all purchases made by a specific user' })
@ApiParam({ name: 'id', type: Number, description: 'User ID' })
@ApiResponse({ status: 200, description: 'User purchases fetched successfully' })
@ApiResponse({ status: 404, description: 'User not found' })
@ApiResponse({ status: 500, description: 'Failed to fetch user purchases' })
async getUserPurchases(@Param('id', ParseIntPipe) userId: number) {
  try {
    const purchases = await this.usersService.getUserPurchases(userId);
    return {
      message: 'User purchases fetched successfully',
      data: purchases,
    };
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    throw new InternalServerErrorException('Failed to fetch user purchases');
  }
}


  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a user account' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Failed to activate user' })
  async activateUser(@Param('id') userId: number) {
    try {
      const result = await this.usersService.activateUser(userId);
      if (!result) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return {
        message: 'User activated successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error activating user:', error);
      throw new InternalServerErrorException('Failed to activate user');
    }
  }

  @Put(':id')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Update user details' })
@ApiParam({ name: 'id', type: Number, description: 'User ID' })
@ApiBody({ type: UpdateUserDto })
@ApiResponse({ status: 200, description: 'User updated successfully' })
@ApiResponse({ status: 400, description: 'Invalid input data' })
@ApiResponse({ status: 404, description: 'User not found' })
@ApiResponse({ status: 500, description: 'Internal server error' })
async updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
  try {
    const existing = await this.usersService.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = await this.usersService.update(id, dto);
    return {
      message: 'User updated successfully',
      data: updated,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new InternalServerErrorException('Failed to update user');
  }
}
}