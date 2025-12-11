import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo, ['name', 'age', 'email'], 'User');
  }

  async purchaseItem(userId: number, itemName: string, quantity: number) {
    if (!itemName?.trim()) {
      throw new BadRequestException('Item name cannot be empty.');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero.');
    }

    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const purchase = {
      userId,
      itemName: itemName.trim(),
      quantity,
      date: new Date().toISOString(),
    };

    return purchase;
  }

 
  async getUserPurchases(userId: number) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return [
      { itemName: 'Notebook', quantity: 2, date: '2025-12-10' },
      { itemName: 'Pen', quantity: 5, date: '2025-12-09' },
    ];
  }

  
  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  
  async activateUser(userId: number) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user['isActive'] = true;
    await this.repo.save(user);

    return user;
  }

  
  async findByEmail(email: string) {
    if (!email?.includes('@')) {
      throw new BadRequestException('Invalid email format');
    }

    return this.repo.findOne({ where: { email } });
  }
}
