import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Order } from '@prisma/client';
import { UpdateOrderStatusDTO } from './dto/update-order-status.dto';

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

  @Get(':orderId')
  async getOrder(
    @Request()
    req,
    @Param(
      'orderId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    orderId,
  ): Promise<Order | { status: number; message: string }> {
    try {
      const userId = req.user.userId;
      return await this.ordersService.getOrder(orderId, userId);
    } catch (err) {
      console.log(err);
      return {
        status: err.status || 500,
        message: err.response || 'An error occurred while updating the product',
      };
    }
  }

  @Put(':orderId/status')
  async updateOrder(
    @Request()
    req,
    @Param(
      'orderId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    orderId,
    @Body()
    updateOrderStatusDto: UpdateOrderStatusDTO,
  ) {
    try {
      const userId = req.user.userId;
      return await this.ordersService.updateOrder(
        orderId,
        userId,
        updateOrderStatusDto.status,
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
