import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/jwt.config';
import UserLocations from './location-user.entity';
import { UserLocationService } from './location-user.service';
import { UserLocationController } from './location-user.controller';
import Users from '../user/user.entity';
import { SocketGateway } from '../socket/socket.service';
import { TimerService } from '../timer/timer.service';
import Timers from '../timer/timer.entity';
import Tasks from '../task/entity/task.entity';
import WorkLocationLists from '../work-location/entity/work.location-list.entity';
import GroupTaskUsers from '../task/entity/groupTaskUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserLocations, Timers, Tasks, GroupTaskUsers, WorkLocationLists]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [UserLocationController],
  providers: [UserLocationService, SocketGateway, TimerService],
})
export class UserLocationModule {}
