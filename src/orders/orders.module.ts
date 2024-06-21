import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/auth/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, JwtService],
})
export class OrdersModule {}
