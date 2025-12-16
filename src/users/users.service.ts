import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const user = await this.findOne(userId);

    return {
      userId: user.id,
      itemName,
      quantity,
      date: new Date().toISOString(),
    };
  }

  async getUserPurchases(userId: number) {
    await this.findOne(userId);

    return [
      { itemName: 'Notebook', quantity: 2, date: '2025-12-10' },
      { itemName: 'Pen', quantity: 5, date: '2025-12-09' },
    ];
  }

  async activateUser(userId: number) {
    const user = await this.findOne(userId);
    user.isActive = true;
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }
}
