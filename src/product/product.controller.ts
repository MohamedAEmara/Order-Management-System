import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDTO } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProduct(
    @Body()
    product: CreateProductDTO,
    @Request()
    req,
  ): Promise<Product | { statusCode: number; message: string }> {
    try {
      const userId = req.user.userId;
      console.log(userId);
      if (!userId) {
        const err = new HttpException(
          'Please login to be able to create a product',
          HttpStatus.UNAUTHORIZED,
        );
        throw err;
      }
      const newProduct = await this.productService.createProduct(product);
      return newProduct;
    } catch (err) {
      return {
        statusCode: err.status,
        message: err.response,
      };
    }
  }

  @Patch(':productId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProduct(
    @Body()
    updateProductDTO: UpdateProductDTO,
    @Request()
    req,
    @Param(
      'productId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId,
  ): Promise<Product | { status: number; message: string }> {
    try {
      const userId = req.user.userId;
      if (!userId) {
        const err = new HttpException(
          'Please login to be able to update products',
          HttpStatus.UNAUTHORIZED,
        );
        throw err;
      }
      const updatedProduct = await this.productService.updateProduct(
        productId,
        updateProductDTO,
      );
      return updatedProduct;
    } catch (err) {
      return {
        status: err.status || 500,
        message: err.response || 'An error occurred while updating the product',
      };
    }
  }
}
