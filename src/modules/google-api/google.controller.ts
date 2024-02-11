import { Controller, Get, ParseFloatPipe, Query, Res } from "@nestjs/common";
import { GoogleApiService } from "./google.service";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags('geojson')
@Controller('geojson')
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