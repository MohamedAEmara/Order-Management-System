import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
