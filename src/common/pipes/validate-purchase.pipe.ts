import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidatePurchasePipe implements PipeTransform {
  transform(value: any) {
    console.log('Incoming body:', value, 'Type:', typeof value);

    
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        throw new BadRequestException('Request body must be valid JSON.');
      }
    }

 
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('Request body must be a valid JSON object.');
    }

    const { itemName, quantity } = value;

 
    if (!itemName || typeof itemName !== 'string' || itemName.trim().length < 2) {
      throw new BadRequestException('Invalid or missing "itemName" — must be a string with at least 2 characters.');
    }

  
    if (quantity === undefined || isNaN(quantity) || Number(quantity) <= 0) {
      throw new BadRequestException('Invalid or missing "quantity" — must be a positive number.');
    }

   
    return {
      itemName: itemName.trim(),
      quantity: Number(quantity),
    };
  }
}
