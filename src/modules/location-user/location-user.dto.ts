import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserLocationDTO {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;
}

export class UpdateUserLocationDTO {
  @ApiProperty()
  @IsOptional()
  lat: number;

  @ApiProperty()
  @IsOptional()
  lng: number;
}

export class QueryUserLocationDTO {
  @ApiProperty({
    description: 'find By user_id',
    required: false,
  })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'find By year',
    required: false,
  })
  @IsOptional()
  year?: number;

  @ApiProperty({
    description: 'find By month',
    required: false,
  })
  @IsOptional()
  month?: string;

  @ApiProperty({
    description: 'find By date',
    required: false,
  })
  @IsOptional()
  date?: string;

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
