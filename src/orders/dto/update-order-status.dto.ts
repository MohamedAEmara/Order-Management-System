import { IsString } from 'class-validator';

export class UpdateOrderStatusDTO {
  @IsString()
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
}
