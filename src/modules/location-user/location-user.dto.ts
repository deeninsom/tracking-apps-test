import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserLocationDTO {
  @ApiProperty()
  lat: string;

  @ApiProperty()
  lng: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;
}

export class UpdateUserLocationDTO {
  @ApiProperty()
  @IsOptional()
  lat: string;

  @ApiProperty()
  @IsOptional()
  lng: string;
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
