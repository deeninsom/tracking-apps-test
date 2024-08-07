import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

// module
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ImageController } from './modules/cloudinary/cloudinary.controller';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import cloudinaryConfig from './modules/cloudinary/cloudinary.config';

// entity
import Users from './modules/user/user.entity';
import UserLocations from './modules/location-user/location-user.entity';
import { UserLocationModule } from './modules/location-user/location-user.module';
import WorkLocations from './modules/work-location/entity/work-location.entity';
import WorkLocationLists from './modules/work-location/entity/work.location-list.entity';
import { WorkLocationModule } from './modules/work-location/work-location.module';
import { SocketGateway } from './modules/socket/socket.service';
import { AppController } from './base-api';
import { GoogleApiModule } from './modules/google-api/google.module';
import { TimerModule } from './modules/timer/timer.module';
import Timers from './modules/timer/timer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'Production'
          ? process.env.NODE_ENV
          : process.env.NODE_ENV,
      load: [cloudinaryConfig],
    }),

    MulterModule.register(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME,
      synchronize: process.env.SYNC_DB === 'true',
      entities: [
        Users,
        UserLocations,
        WorkLocations,
        WorkLocationLists,
        Timers
      ],
    }),

    AuthModule,
    UserModule,
    UserLocationModule,
    WorkLocationModule,
    GoogleApiModule,
    TimerModule
  ],
  controllers: [ImageController, AppController],
  providers: [CloudinaryService, SocketGateway],
})
export class AppModule { }
