import { Module } from '@nestjs/common';
import { GoogleApiService } from './google.service';
import { GoogleApiController } from './google.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [GoogleApiController],
  providers: [GoogleApiService],
})
export class GoogleApiModule { }
