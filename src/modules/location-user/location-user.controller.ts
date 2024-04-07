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
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { UserLocationService } from './location-user.service';
import {
  CreateLocationUserV2DTO,
  CreateUserLocationDTO,
  QueryUserLocationDTO,
  // QueryUserLocationOnMobileDTO,
  QueryUserLocationV2DTO,
  UpdateUserLocationDTO,
} from './location-user.dto';

@ApiTags('user-locations')
@Controller('user-locations')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UserLocationController {
  constructor(private readonly userLocationService: UserLocationService) {}

  @Get()
  async get(@Query() query: QueryUserLocationDTO, @Res() res: Response) {
    try {
      const {
        data
      } = await this.userLocationService.get();
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

  @Get('v2')
  async getLocationUsersV2(
    @Query() query: QueryUserLocationV2DTO,
    @Res() res: Response,
  ) {
    try {
      const {
        data,
        // page: currentPage,
        // totalPages,
        // totalRows,
      } = await this.userLocationService.getLocationUsersV2(
        query.user_id,
        query.date,
        query.sort,
        query.page,
        query.limit,
      );
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan lokasi user',
        // page: currentPage,
        // totalPages,
        // totalRows,
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

  @Post('v2')
  async createLocationUserV2(
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const { userId, lat, lng, isActive, speed, status, created_at, updated_at } = body;
      const newLocationUser = await this.userLocationService.createLocationUserV2(userId, lat, lng, isActive, speed,status, created_at, updated_at);
      return res.status(201).json({
        status: true,
        message: 'Berhasil menambahkan lokasi user',
        data: newLocationUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan server!',
        error: error.message,
      });
    }
  }

  @Get('v3')
  async getLocationUsersV3(
    @Query() query: QueryUserLocationV2DTO,
    @Res() res: Response,
  ) {
    try {
      const {
        data
      } = await this.userLocationService.getLocationUsersV3(
        query.user_id,
        query.date,
        query.sort
      );
      return res.status(200).json({
        status: true,
        message: 'sBerhasil menampilkan lokasi user',
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

  // @Get('sort-today')
  // async getForMobile(
  //   @Query() query: QueryUserLocationOnMobileDTO,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const { data } = await this.userLocationService.getForMobile(query.user);
  //     return res.status(200).json({
  //       status: true,
  //       message: 'Berhasil menampilkan lokasi user terkini',
  //       data,
  //     });
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

  @Get(':user_id')
  async getUserById(@Param('user_id') id: string, @Res() res: Response) {
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
      return res.status(200).json({
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
