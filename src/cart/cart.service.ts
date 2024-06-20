import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma.service';
import { AddToCartDTO } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCartDTO, userId: string) {
    const quantity = addToCartDto.quantity;
    const productId = addToCartDto.productId;

    // Check if the quantity is invalid value
    if (!quantity || quantity <= 0) {
      throw new HttpException(
        'Invalid quantity! please add a positive number of items.',
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

    // Check if the product exists
    const product = await this.prisma.product.findFirst({
      where: {
        productId,
      },
    });
    if (!product) {
      throw new HttpException('Inavlid product id!', HttpStatus.BAD_REQUEST);
    }

    // Check if the item already exists in the cart?
    const cart = await this.prisma.cart.findFirst({
      where: {
        cartId: user.cartId,
      },
      include: {
        items: true,
      },
    });

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );
    if (!existingItem) {
      // Create a new productItem then add it to the cart
      const newCartItem = this.prisma.cartItem.create({
        data: {
          productId,
          quantity,
          cartId: cart.cartId,
        },
      });
      const updatedCart = await this.prisma.cart.update({
        where: {
          cartId: user.cartId,
        },
        include: {
          items: true,
        },
        data: {
          items: {
            connect: {
              cartItemId: (await newCartItem).cartItemId,
            },
          },
        },
      });
      return updatedCart;
    } else {
      // increment the quantity of that productId by the needed quantity
      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: user.cartId,
          productId,
        },
      });
      await this.prisma.cartItem.update({
        where: {
          cartItemId: existingCartItem.cartItemId,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
      // return the updated Cart
      const updatedCart = await this.prisma.cart.findFirst({
        where: {
          cartId: user.cartId,
        },
        include: {
          items: true,
        },
      });
      return updatedCart;
    }
  }

  async viewCart(userId: string) {
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
        items: true,
      },
    });
    console.log(cart);
    console.log('-=-=-=-');
    return cart;
  }
}
