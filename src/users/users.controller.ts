import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get(':userId/orders')
  async getOrderHistory(
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId,
  ) {
    try {
      if (!userId) {
        throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
      }
      return await this.usersService.getOrderHistory(userId);
    } catch (err) {
      console.log(err);
      return {
        status: err.status || 500,
        message: err.response || 'An error occurred while updating the product',
      };
    }
  }
}
