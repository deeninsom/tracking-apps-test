import { Module } from '@nestjs/common';
import { GoogleApiService } from './google.service';
import { GoogleApiController } from './google.controller';

@Module({
  controllers: [GoogleApiController],
  providers: [GoogleApiService],
})
export class GoogleApiModule { }
