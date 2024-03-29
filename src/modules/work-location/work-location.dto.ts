import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';


class Location {
  @ApiProperty()
  list_number: number;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;
  
}

export class CreateWorkLocationDTO {
  @ApiProperty()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNumber()
  range: number;

  @ApiProperty()
  @IsEnum(['paid', 'unpaid'])
  payment_status: string;

  @ApiProperty({
    description: 'Array of objects containing latitude (lat) and longitude (lng)',
    type: [Location],
    example: [{ lat: 40.7128, lng: -74.0060, list_number: 0 }]
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

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  range?: number;

  // @ApiProperty()
  // @IsOptional()
  // @IsEnum(['paid', 'unpaid'])
  // payment_status?: string;

  @ApiProperty({
    description: 'Array of objects containing latitude (lat) and longitude (lng)',
    type: [Location],
    example: [{ lat: 40.7128, lng: -74.0060, list_number: 0 }]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Location)
  location?: Location[];
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
