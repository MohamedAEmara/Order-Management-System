import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma.service';
import { CreateOrderDTO } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async createOrder(createOrderDto: CreateOrderDTO, userId: string) {
    const address = createOrderDto.address;
    const method = createOrderDto.method;

    // Check a valid method
    if (method !== 'cash' && method !== 'credit') {
      throw new HttpException(
        'method can only be cash or credit',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Check if the user exists
    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new HttpException('Inavlid user id!', HttpStatus.BAD_REQUEST);
    }

    // Check if the Cart is empty
    const cart = await this.prisma.cart.findFirst({
      where: {
        cartId: user.cartId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });
    if (!cart.items || cart.items.length === 0) {
      throw new HttpException(
        'Cart is empty! add items to cart first.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const shippingAddress = address;
    let billingAddress;
    if (method === 'cash') {
      billingAddress = shippingAddress;
    } else {
      billingAddress = 'online';
    }
    let totalAmount = 0;
    cart.items.forEach(
      (item) => (totalAmount += item.quantity * item.product.price),
    );

    // Create a new order
    const newOrder = await this.prisma.order.create({
      data: {
        cart: { connect: { cartId: cart.cartId } }, // Connect order to cart
        status: 'pending', // Set initial order status
        paymentMethod: method,
        shippingAddress,
        billingAddress,
        totalAmount,
      },
    });

    // Empty the cart and store the order in the "orders" field in cart
    await this.prisma.cart.update({
      where: {
        cartId: user.cartId,
      },
      data: {
        items: {
          deleteMany: {},
        },
      },
    });

    return newOrder;
  }

  async getOrder(orderId: string, userId: string) {
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
    const order = await this.prisma.order.findFirst({
      where: {
        orderId,
      },
    });

    // Validate that this order belongs to this user
    if (!order || user.cartId !== order.cartId) {
      throw new HttpException(
        'There is no order with this ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    return order;
  }

  async updateOrder(
    orderId: string,
    userId: string,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled',
  ) {
    // Validate status value
    const orderStatus = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'canceled',
    ];
    if (!orderStatus.includes(status)) {
      throw new HttpException(
        'status must be pending, processing, shipped, delivered, or canceled',
        HttpStatus.BAD_REQUEST,
      );
    }
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
    const order = await this.prisma.order.findFirst({
      where: {
        orderId,
      },
    });

    // Validate that this order belongs to this user
    if (!order || user.cartId !== order.cartId) {
      throw new HttpException(
        'There is no order with this ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: {
        orderId,
      },
      data: {
        status,
      },
    });
    return updatedOrder;
  }
}
