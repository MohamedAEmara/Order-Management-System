import { IsNumber, IsString } from 'class-validator';

export class AddToCartDTO {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}
