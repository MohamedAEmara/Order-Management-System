import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/auth/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
    if (!createProductDTO.name || !createProductDTO.price) {
      throw new HttpException(
        'Please provide these fields for the product (name, price)',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!createProductDTO.stock) createProductDTO.stock = 0;
    const product = await this.prisma.product.create({
      data: createProductDTO,
    });

    return product;
  }

  async updateProduct(
    productId: string,
    updateProductDTO: UpdateProductDTO,
  ): Promise<Product> {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        productId,
      },
    });
    if (!existingProduct) {
      throw new HttpException(
        'There is no product with this ID',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedProduct = await this.prisma.product.update({
      where: {
        productId,
      },
      data: {
        name: updateProductDTO.name
          ? updateProductDTO.name
          : existingProduct.name,
        price: updateProductDTO.price
          ? updateProductDTO.price
          : existingProduct.price,
        description: updateProductDTO.description
          ? updateProductDTO.description
          : existingProduct.description,
        stock: updateProductDTO.stock
          ? updateProductDTO.stock
          : existingProduct.stock,
      },
    });

    return updatedProduct;
  }
}
