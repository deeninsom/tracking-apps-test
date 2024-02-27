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
import { WorkLocationService } from './work-location.service';
import {
 CreateWorkLocationDTO,
 UpdateWorkLocationDTO,
 QueryWorkLocationDTO
} from './work-location.dto';

@ApiTags('work-locations')
@Controller('work-locations')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class WorkLocationController {
  constructor(private readonly workLocationService: WorkLocationService) { }

  @Get()
  async get(@Query() query: QueryWorkLocationDTO, @Res() res: Response) {
    try {
      const {
        data,
        page: currentPage,
        totalPages,
        totalRows,
      } = await this.workLocationService.get(
        query.page,
        query.limit
      );
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan lokasi kerja',
        page: currentPage,
        totalPages,
        totalRows,
        data
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
      const data = await this.workLocationService.getId(id);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan lokasi',
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
  async create(@Body() payload: CreateWorkLocationDTO, @Res() res: Response) {
    try {
      const data = await this.workLocationService.create(payload);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menambahkan lokasi.',
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
    @Body() payload: UpdateWorkLocationDTO,
    @Res() res: Response,
  ) {
    try {
      const data = await this.workLocationService.update(id, payload);
      return res
        .status(200)
        .json({ status: true, message: 'Berhasil update lokasi.', data });
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
      await this.workLocationService.delete(id);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Berhasil menghapus lokasi.',
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
