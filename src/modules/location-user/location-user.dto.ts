import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
  // @ApiProperty({
  //   description: 'find By user_id',
  //   required: false,
  // })
  // @IsOptional()
  // user_id?: string;

  // @ApiProperty({
  //   description: 'find By year',
  //   required: false,
  // })
  // @IsOptional()
  // year?: number;

  // @ApiProperty({
  //   description: 'find By month',
  //   required: false,
  // })
  // @IsOptional()
  // month?: string;

  // @ApiProperty({
  //   description: 'find By date',
  //   required: false,
  // })
  // @IsOptional()
  // date?: string;

  // @ApiProperty({
  //   description: 'sort by date now',
  //   required: false,
  // })
  // @IsOptional()
  // @IsBoolean()
  // sort?: boolean;

  // @ApiProperty({
  //   description: 'get page',
  //   required: false,
  // })
  // @IsOptional()
  // page?: number;

  // @ApiProperty({
  //   description: 'get limit',
  //   required: false,
  // })
  // @IsOptional()
  // limit?: number;
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

export class CreateLocationUserV2DTO {
  @ApiProperty({
    description: 'User ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Latitude',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lat: string;

  @ApiProperty({
    description: 'Longitude',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lng: string;
}

export class QueryUserLocationOnMobileDTO {
  @ApiProperty({
    description: 'find By user_id',
    required: false,
  })
  @IsOptional()
  user?: string;
}
