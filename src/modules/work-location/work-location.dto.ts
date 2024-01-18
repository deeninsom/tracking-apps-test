import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, ValidateNested } from 'class-validator';


class Location {
  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;
}

export class CreateWorkLocationDTO {
  @ApiProperty()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Array of objects containing latitude (lat) and longitude (lng)',
    type: [Location],
    example: [{ lat: 40.7128, lng: -74.0060 }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Location)
  location: Location[];
}
export class UpdateWorkLocationDTO {

  @ApiProperty()
  @IsOptional()
  label?: string;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;
}

export class QueryWorkLocationDTO {
  @ApiProperty({
    description: 'get page',
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'get limit',
    required: false,
  })
  @IsOptional()
  limit?: number;

}
