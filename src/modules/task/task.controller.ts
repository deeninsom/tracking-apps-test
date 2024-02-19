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
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { CreateTaskDto, QueryTaskDTO, UpdateTaskDto } from './task.dto';

@ApiTags('task')
@Controller('task')
// @UseGuards(AuthGuard)
// @ApiBearerAuth('access-token')
export class TasksController {
  constructor(private readonly taskService: TaskService) { }

  @Get()
  async get(
    @Query() query: QueryTaskDTO,
    @Res() res: Response,
  ) {
    try {
      const {
        data,
        page: currentPage,
        totalPages,
        totalRows,
      } = await this.taskService.get(query.page, query.limit);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan task',
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
      const data = await this.taskService.getId(id);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menampilkan task',
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
  async create(@Body() payload: CreateTaskDto, @Res() res: Response) {
    try {
      const data = await this.taskService.create(payload);
      return res.status(200).json({
        status: true,
        message: 'Berhasil menambahkan task.',
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
    @Body() payload: UpdateTaskDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.taskService.update(id, payload);
      return res
        .status(200)
        .json({ status: true, message: 'Berhasil update task.', data });
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
      await this.taskService.delete(id);
      return res
        .status(200)
        .json({ status: true, message: 'Berhasil menghapus task.', data: {} });
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
