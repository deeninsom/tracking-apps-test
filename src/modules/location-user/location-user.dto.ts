import { IsOptional } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

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
    required: false
  })
  @IsOptional()
  user_id?: string

  @ApiProperty({
    description: 'find By date',
    required: false
  })
  @IsOptional()
  created_at?: string
}