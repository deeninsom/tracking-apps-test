import { Controller, Get, ParseFloatPipe, Query, Res, UseGuards } from "@nestjs/common";
import { GoogleApiService } from "./google.service";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from "express";

@ApiTags('geojson')
@Controller('geojson')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class GoogleApiController {
  constructor(private readonly googleApiService: GoogleApiService) {}

  @Get()
  async findPlaceFromLatLng(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.googleApiService.getPlaceFromLatLng(lat, lng);
    return res.status(200).json({data: result})
  }
}