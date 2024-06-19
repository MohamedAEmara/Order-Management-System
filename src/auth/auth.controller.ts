import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDTO } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { loginUserDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(
    @Body()
    user: createUserDTO,
  ): Promise<User | { statusCode: number; message: string }> {
    try {
      const newUser = await this.authService.create(user);
      return newUser;
    } catch (err) {
      return {
        statusCode: err.status,
        message: err.response,
      };
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body()
    loginDTO: loginUserDTO,
  ): Promise<
    { accessToken: string } | { statusCode: number; message: string }
  > {
    try {
      return await this.authService.login(loginDTO);
    } catch (err) {
      console.log(err);
      return {
        statusCode: err.status,
        message: err.response,
      };
    }
  }
}
