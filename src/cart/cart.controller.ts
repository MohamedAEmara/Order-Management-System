import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/add-to-cart.dto';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addToCart(
    @Body()
    addToCartDto: AddToCartDTO,
  ) {
    try {
      return await this.cartService.addToCart(addToCartDto);
    } catch (err) {
      console.log(err);
      return {
        statusCode: err.status,
        message: err.response,
      };
    }
  }
}
