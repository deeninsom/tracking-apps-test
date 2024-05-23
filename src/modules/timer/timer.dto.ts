import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { IsOptional } from "class-validator";

export class QueryTimerDTO {
    @ApiProperty({
        description: 'get user id',
        required: true,
    })
    user_id?: string;

}

export class QueryTimerLocationDTO {
    @ApiProperty({
        description: 'get user id',
        required: true,
    })
    user_id?: string;

    @ApiProperty({
        description: 'find By date (YYYY-MM-DD)',
        required: false,
    })
    @IsOptional()
    date?: string;
}