import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

class GroupTaskUserDto {
  @ApiProperty()
  user_id: string;
}

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  location_id: string;

  @ApiProperty({
    description: 'Array of objects containing user id',
    type: [GroupTaskUserDto],
    example: [{ user_id: 'uuid' }]
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupTaskUserDto)
  users: GroupTaskUserDto[];
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupTaskUserDto)
  users: GroupTaskUserDto[];

  @ApiProperty()
  @IsOptional()
  location_id: string;
}

export class QueryTaskDTO {
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