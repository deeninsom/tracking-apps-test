import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { CreateUserDto, QueryUserDTO, UpdateUserDto } from './user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async get(
    @Query() query: QueryUserDTO,
    @Res() res: Response,
  ) {
    try {
      const {
        data,
        page: currentPage,
        totalPages,
        totalRows,
      } = await this.userService.get(query.page, query.limit);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan user',
        page: currentPage,
        totalPages,
        totalRows,
        data,
      });
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

  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.userService.getId(id);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan user',
        data,
      });
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

  @Post()
  async create(@Body() payload: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.userService.create(payload);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menambahkan user.',
        data,
      });
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.update(id, payload);
      return res
        .status(200)
        .json({ status: true, message: 'Berhasil update user.', data });
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

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.delete(id);
      return res
        .status(200)
        .json({ status: true, message: 'Berhasil menghapus user.', data: {} });
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
