import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class PinsOutput {
  @ApiResponseProperty({
    type: 'integer',
  })
  id: number;
  @ApiResponseProperty({
    type: 'string',
  })
  username: string;
  @ApiResponseProperty({
    type: 'string',
  })
  displayname: string;
  @ApiResponseProperty({
    type: 'string',
  })
  avatarUrl: string;
  @ApiResponseProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: string;
  @ApiResponseProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        url: { type: 'string' },
        filename: { type: 'string' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  pins: {
    id: number;
    url: string;
    filename: string;
    name: string;
    createdAt: Date;
  }[];
}
