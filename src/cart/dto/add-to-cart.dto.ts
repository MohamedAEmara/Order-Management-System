import { IsNumber, IsString } from 'class-validator';

export class AddToCartDTO {
  @IsString()
  productId: string;

  @IsString()
  userId: string;

  @IsNumber()
  quantity: number;
}
