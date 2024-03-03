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
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('access-token')
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
  }
  