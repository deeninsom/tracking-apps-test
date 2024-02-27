import {
    Controller,
    UseGuards,
    Get,
    Query,
    Res,
    HttpException,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { AuthGuard } from '../auth/auth.guard';
  import { Response } from 'express';
import { TimerService } from './timer.service';
import { QueryTimerDTO } from './timer.dto';
  
  @ApiTags('timers')
  @Controller('timers')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  export class TimerController {
    constructor(private readonly timerService: TimerService) { }
  
    @Get()
    async get(
      @Query() query: QueryTimerDTO,
      @Res() res: Response,
    ) {
      try {
        const data = await this.timerService.get(query.user_id);
        return res.status(200).json({
          status: true,
          message: 'Berhasil menampilkan hasil timer',
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

    @Get('result-timer')
    async getResultTimer(
      @Query() query: QueryTimerDTO,
      @Res() res: Response,
    ) {
      try {
        const data = await this.timerService.getResultTimer(query.user_id);
        return res.status(200).json({
          status: true,
          message: 'Berhasil menampilkan hasil timer',
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
  
    // @Get(':id')
    // async getUserById(@Param('id') id: string, @Res() res: Response) {
    //   try {
    //     const data = await this.taskService.getId(id);
    //     return res.status(200).json({
    //       status: true,
    //       message: 'Berhasil menampilkan task',
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
  
    // @Post()
    // async create(@Body() payload: CreateTaskDto, @Res() res: Response) {
    //   try {
    //     const data = await this.taskService.create(payload);
    //     return res.status(200).json({
    //       status: true,
    //       message: 'Berhasil menambahkan task.',
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
  
    // @Put(':id')
    // async update(
    //   @Param('id') id: string,
    //   @Body() payload: UpdateTaskDto,
    //   @Res() res: Response,
    // ) {
    //   try {
    //     const data = await this.taskService.update(id, payload);
    //     return res
    //       .status(200)
    //       .json({ status: true, message: 'Berhasil update task.', data });
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
  
    // @Delete(':id')
    // async delete(@Param('id') id: string, @Res() res: Response) {
    //   try {
    //     await this.taskService.delete(id);
    //     return res
    //       .status(200)
    //       .json({ status: true, message: 'Berhasil menghapus task.', data: {} });
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
  }
  