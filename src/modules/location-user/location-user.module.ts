import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/jwt.config';
import UserLocations from './location-user.entity';
import { UserLocationService } from './location-user.service';
import { UserLocationController } from './location-user.controller';
import Users from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserLocations]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [UserLocationController],
  providers: [UserLocationService],
})
export class UserLocationModule {}
