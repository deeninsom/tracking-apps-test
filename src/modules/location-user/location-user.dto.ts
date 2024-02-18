import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

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
    description: 'sort by date now',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sort?: boolean;

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
export enum SortingDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryUserLocationV2DTO {
  @ApiProperty({
    description: 'find By user_id',
    required: false,
  })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'find By date (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'Sort by date = ASC | DESC',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortingDirection)
  sort?: SortingDirection;

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

export class QueryUserLocationOnMobileDTO {
  @ApiProperty({
    description: 'find By user_id',
    required: false,
  })
  @IsOptional()
  user?: string;
}
