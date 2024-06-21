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
    // I want to get the orders array linked to cart with (orders) field
    // const newCart = await this.prisma.order.findFirst({
    //     include: {
    //         cart
    //     }
    // })
    // const order = await this.prisma.order.create({
    //   data: {
    //     shippingAddress,
    //     billingAddress,
    //     status: 'pending',
    //     paymentMethod: method,
    //     totalAmount,

    // },

    // });
    // const newOrder = await this.prisma.order.create({
    //   data: {
    //     // cart: { connect: { cartId: user.cartId } }, // Connects the order to the cart
    //     status: 'pending', // Set initial order status (e.g., pending)
    //     paymentMethod: method, // Specify payment method
    //     shippingAddress: shippingAddress, // Customer's shipping address
    //     billingAddress: billingAddress, // Customer's billing address (optional)
    //     totalAmount: totalAmount,
    //     // items: {
    //     //   connect: cart.items.map((item) => ({
    //     //     where: { cartItemId: item.cartItemId },
    //     //   })),
    //     // }, // Connects order to each cart item
    //   },
    // });

    // await this.prisma.cart.update({
    //     where: {
    //       cartId: cart.cartId,
    //     },
    //     data: {
    //       items: {
    //         deleteMany: {},
    //       },
    //     },
    //   });
    // const newCart = await this.prisma.cart.findFirst({
    //     where: {
    //         cartId: user.cartId,
    //     },
    //     include: {
    //         items: true,
    //     }
    // });
    // console.log(newCart);
    // console.log("-=-=-=-=");
    // console.log(newOrder);
    // const test = await this.prisma.cart.findFirst({
    //   where: {
    //     cartId: user.cartId,
    //   },
    //   include: {
    //     items: {
    //       select: {
    //         orderId: true,
    //       },
    //     },
    //   },
    // });

    // const updatedOrder = await this.prisma.order.update({
    //   where: {
    //     orderId: order.orderId,
    //   },
    //   //   include: {
    //   //     items: {
    //   //       include: {
    //   //         cart: {
    //   //           include: {
    //   //             user: {
    //   //               select: {
    //   //                 userId: true,
    //   //               },
    //   //             },
    //   //           },
    //   //         },
    //   //       },
    //   //     },
    //   //   },
    //   data: {
    //     status: 'processing',
    //     items: {
    //       connect: {
    //         cart:
    //       },
    //     },
    //   },
    // });
    // console.log(updatedOrder);

    // console.log(test);
    // Update cart
    // await this.prisma.cart.update({
    //   where: {
    //     cartId: user.cartId,
    //   },
    //   data: {
    //     items: {
    //         connect:
    //     }
    //   },
    // });
    // return test;
  }
}
