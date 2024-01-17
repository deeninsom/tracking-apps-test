import {
  Controller,
  // UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Res,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { UserLocationService } from './location-user.service';
import {
  CreateUserLocationDTO,
  QueryUserLocationDTO,
  UpdateUserLocationDTO,
} from './location-user.dto';

@ApiTags('user-locations')
@Controller('users-locations')
// @UseGuards(AuthGuard)
// @ApiBearerAuth('access-token')
export class UserLocationController {
  constructor(private readonly userLocationService: UserLocationService) {}

  @Get()
  async get(@Query() query: QueryUserLocationDTO, @Res() res: Response) {
    try {
      const data = await this.userLocationService.get(
        query.user_id,
        query.year,
        query.month,
        query.date,
      );
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan lokasi user',
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
      const data = await this.userLocationService.getId(id);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan lokasi user',
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
  async create(@Body() payload: CreateUserLocationDTO, @Res() res: Response) {
    try {
      const data = await this.userLocationService.create(payload);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menambahkan lokasi user.',
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
    @Body() payload: UpdateUserLocationDTO,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userLocationService.update(id, payload);
      return res
        .status(200)
        .json({ status: true, message: 'Berhasil update lokasi user.', data });
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
      await this.userLocationService.delete(id);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Berhasil menghapus lokasi user.',
          data: {},
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
}
