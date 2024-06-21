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
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Cart } from '@prisma/client';

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

  @Get(':userId')
  @UseGuards(AuthGuard)
  async viewCart(
    @Request()
    req,
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId,
  ): Promise<Cart | { status: number; message: string }> {
    try {
      const userIdFromToken = req.user.userId;
      // Validate that the logged-in user same as the param
      if (userIdFromToken !== userId) {
        throw new HttpException(
          'Only the user can view his own cart. Please login first',
          HttpStatus.BAD_REQUEST,
        );
      }
      const cart = await this.cartService.viewCart(userId);
      return cart;
    } catch (err) {
      console.log(err);
      return {
        status: err.status || 500,
        message: err.response || 'An error occurred while updating the product',
      };
    }
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateCart(
    @Request()
    req,
    @Body()
    updateCartDto: AddToCartDTO,
  ) {
    try {
      const userId = req.user.userId;
      return await this.cartService.updateCart(updateCartDto, userId);
    } catch (err) {
      console.log(err);
      return {
        status: err.status || 500,
        message: err.response || 'An error occurred while updating the product',
      };
    }
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  async removeFromCart(
    @Request()
    req,
    @Body()
    removeProductDto: Pick<AddToCartDTO, 'productId'>,
  ) {
    try {
      const userId = req.user.userId;
      return await this.cartService.removeFromCart(
        removeProductDto.productId,
        userId,
      );
    } catch (err) {
      console.log(err);
      return {
        status: err.status || 500,
        message: err.response || 'An error occurred while updating the product',
      };
    }
  }
}
