import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Visibility } from 'src/board/board.entity';

export class SaveTagOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  url: string;
  @ApiResponseProperty()
  fileuuid: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  thumbnail: string;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer' },
      },
    },
  })
  tags: {
    id: number;
  }[];
}
