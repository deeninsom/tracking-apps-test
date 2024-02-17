import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/jwt.config';
import Timers from './timer.entity';
import Tasks from '../task/task.entity';
import WorkLocationLists from '../work-location/entity/work.location-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timers, Tasks, WorkLocationLists]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [TimerController],
  providers: [TimerService],
})
export class TimerModule { }
