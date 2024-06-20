import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcryptjs';
import { createUserDTO } from './dto/create-user.dto';
import { loginUserDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from './auth.types';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(user: createUserDTO): Promise<User> {
    if (
      !user.address ||
      !user.name ||
      !user.email ||
      !user.password ||
      !user.phone
    ) {
      throw new HttpException(
        'Please fill in all required fileds (name, email, password, phone, address)',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ensure a unique email
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (existingUser) {
      throw new HttpException(
        'This email is already registered, try login instead',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    // Change the password with the hashed one to store in DB
    user.password = await bcrypt.hash(user.password, salt);

    // Create an empty cart and attach cartId to the newly created user
    const newCart = await this.prisma.cart.create({
      data: {
        items: {
          create: [],
        },
      },
    });

    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        cartId: newCart.cartId,
      },
    });

    // Execlude passwort from user response.
    delete newUser.password;
    return newUser;
  }

  async login(loginDTO: loginUserDTO): Promise<{ accessToken: string }> {
    if (!loginDTO.email || !loginDTO.password) {
      throw new HttpException(
        'Please enter email & password to login',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.user.findFirst({
      where: { email: loginDTO.email },
    });
    // const salt = await bcrypt.genSalt();
    // Change the password with the hashed one to store in DB
    // const hashedPassword = await bcrypt.hash(user.password, salt);
    if (!user) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const matchedPassword = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    const salt = await bcrypt.genSalt();
    // Change the password with the hashed one to store in DB
    const hashedPassword = await bcrypt.hash(user.password, salt);

    console.log(hashedPassword);
    console.log(user.password);
    if (!matchedPassword) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('passed');
    const payload: PayloadType = { email: user.email, userId: user.userId };
    console.log('two');
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET,
    });
    console.log('token' + accessToken);
    console.log('token');
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.SECRET,
      }),
    };
  }
}
