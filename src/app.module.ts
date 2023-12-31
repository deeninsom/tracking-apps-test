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
import { SocketModule } from './modules/socket/socket.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'Production'
          ? '.env.production'
          : '.env.development',
      load: [cloudinaryConfig],
    }),

    MulterModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME,
      synchronize: true,
      entities: [
        Users,
      ],
    }),

    AuthModule,
    UserModule,
    SocketModule
  ],
  controllers: [ImageController],
  providers: [CloudinaryService],
})
export class AppModule {}
