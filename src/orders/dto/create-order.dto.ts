import { IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  address: string;

  @IsString()
  method: 'cash' | 'credit';
}
