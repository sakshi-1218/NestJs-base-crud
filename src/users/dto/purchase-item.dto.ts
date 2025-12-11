import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Length } from 'class-validator';

export class PurchaseItemDto {
  @ApiProperty({
    example: 'Notebook',
    description: 'Name of the item being purchased',
  })
  @IsString()
  @Length(2, 100, { message: 'Item name must be between 2 and 100 characters' })
  itemName: string;

  @ApiProperty({
    example: 3,
    description: 'Quantity of the item to purchase',
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
