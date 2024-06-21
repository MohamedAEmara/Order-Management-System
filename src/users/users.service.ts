import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getOrderHistory(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new HttpException(
        'There is no user with this ID',
        HttpStatus.BAD_REQUEST,
      );
    }
    const cart = await this.prisma.cart.findFirst({
      where: {
        cartId: user.cartId,
      },
      include: {
        orders: true,
      },
    });
    return {
      orders: cart.orders,
    };
  }
}
