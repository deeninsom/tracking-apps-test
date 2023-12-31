import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "./user.entity";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  image_url: string[];

  @ApiProperty({ enum: Role })
  role: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  lat?: number;

  @ApiProperty()
  @IsOptional()
  lng?: number;

  @ApiProperty()
  @IsOptional()
  image_url?: string[];

  @ApiProperty({ enum: Role })
  @IsOptional()
  role?: string;
}
