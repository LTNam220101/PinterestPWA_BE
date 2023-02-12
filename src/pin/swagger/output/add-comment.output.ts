import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class AddCommentOutput {
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
        content: { type: 'string' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        user: { type: 'object' },
      },
    },
  })
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: number;
      username: string;
      displayName: string;
      avatarUrl: string;
    }
  }[];
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        displayName: { type: 'string' },
        avatarUrl: { type: 'string' },
      },
    },
  })
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
  }[];
}
