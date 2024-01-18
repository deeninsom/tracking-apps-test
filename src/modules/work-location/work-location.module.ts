import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/jwt.config';
import UserLocations from './entity/work-location.entity';
import { WorkLocationService } from './work-location.service';
import { WorkLocationController } from './work-location.controller';
import Users from '../user/user.entity';
import WorkLocationLists from './entity/work.location-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserLocations, WorkLocationLists]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [WorkLocationController],
  providers: [WorkLocationService],
})
export class WorkLocationModule {}
