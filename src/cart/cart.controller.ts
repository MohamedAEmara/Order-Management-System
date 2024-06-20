import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addToCart(
    @Body()
    addToCartDto: AddToCartDTO,
    @Request()
    req,
  ) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        throw new HttpException(
          'Please login to add new item to your cart',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.cartService.addToCart(addToCartDto, userId);
    } catch (err) {
      console.log(err);
      return {
        statusCode: err.status,
        message: err.response,
      };
    }
  }
}
