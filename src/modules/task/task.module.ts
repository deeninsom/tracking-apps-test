import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './task.controller';
import Users from './task.entity';
import { TaskService } from './task.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/jwt.config';
import Tasks from './task.entity';
import WorkLocations from '../work-location/entity/work-location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks, Users, WorkLocations]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [TasksController],
  providers: [TaskService],
})
export class TaskModule { }