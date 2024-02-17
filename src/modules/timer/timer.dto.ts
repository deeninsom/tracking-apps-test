import { ApiProperty } from "@nestjsx/crud/lib/crud";

export class QueryTimerDTO {
    @ApiProperty({
        description: 'get user id',
        required: true,
    })
    user_id?: string;

}