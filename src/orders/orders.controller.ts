import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDTO } from './dto/create-order.dto';

@Controller('api/orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(
    @Body()
    createOrderDto: CreateOrderDTO,
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
      return await this.ordersService.createOrder(createOrderDto, userId);
    } catch (err) {
      console.log(err);
      return {
        statusCode: err.status,
        message: err.response,
      };
    }
  }
}
