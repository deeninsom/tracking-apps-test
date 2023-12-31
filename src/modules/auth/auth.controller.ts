import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  // RegisterDto,
} from './auth.dto';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // @Post('register')
  // async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
  //   try {
  //     const user = await this.authService.register(registerDto);
  //     return res
  //       .status(200)
  //       .json({ status: true, message: 'Registrasi berhasil.', data: user });
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       return res
  //         .status(error.getStatus())
  //         .json({ status: false, message: error.message });
  //     } else {
  //       return res.status(500).json({
  //         status: false,
  //         message: 'Terjadi kesalahan server !',
  //         error: error.message,
  //       });
  //     }
  //   }
  // }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const user = await this.authService.login(loginDto);
      return res
        .status(200)
        .json({ status: true, message: 'Login berhasil.', data: user });
    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res.status(500).json({
          status: false,
          message: 'Terjadi kesalahan server !',
          error: error.message,
        });
      }
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(400)
          .json({ status: false, message: 'Missing Token' });
      }
      await this.authService.logout(token);
      return res
        .status(200)
        .json({ status: true, message: 'Berhasil Logout !' });
    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res.status(500).json({
          status: false,
          message: 'Terjadi kesalahan server !',
          error: error.message,
        });
      }
    }
  }
}
