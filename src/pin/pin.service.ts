import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board, Visibility } from 'src/board/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { PageDto } from 'src/pagination/page.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/user.entity';
import { UserGateway } from 'src/user/user.gateway';
import { Not, Repository } from 'typeorm';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { RemoveTagDto } from './dto/remove-tag.dto';
import { Pin } from './pin.entity';

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private pinGateway: UserGateway,
  ) {}

  async getPin(id: number) {
    const data = await this.pinRepository.findOne({
      relations: {
        tags: true,
        comments: {
          user: true,
        },
        user: true,
      },
      where: { id: id },
      select: {
        comments: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (!data) {
      throw new NotFoundException('No such pin');
    }
    if (data.user) {
      const [_, count] = await this.userRepository.findAndCount({
        relations: {
          following: true,
        },
        where: {
          following: {
            id: data.user.id,
          },
        },
      });
      return {
        ...data,
        user: {
          ...data.user,
          followersCount: count,
          hashPassword: undefined,
          hashRefeshToken: undefined,
        },
      };
    } else {
      return {
        ...data,
        user: {
          ...data.user,
        },
      };
    }
  }

  async getBoardsByPin(id: number, userId: number, page: PageDto) {
    const [boards, count] = await this.boardRepository.findAndCount({
      relations: {
        user: true,
        pins: true,
      },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        pins: {},
        user: {
          id: true,
          avatarUrl: true,
          displayName: true,
          username: true,
        },
      },
      where: {
        visibility: Visibility.PUBLIC,
        pins: {
          id: id,
        },
        user: {
          id: Not(id),
        },
      },
      take: page.pageSize,
      skip: page.pageSize * (page.pageNum - 1),
    });
    return {
      data: boards,
      total: count,
    };
  }

  async saveTagToPin(tagDto: CreateTagDto, pinId: number) {
    console.log(tagDto);
    let tag: Tag;
    const pin = await this.pinRepository.findOne({
      relations: { tags: true },
      where: { id: pinId },
      select: { tags: { id: true } },
    });
    if (!pin) {
      throw new BadRequestException('pin not found!');
    }
    if (!tagDto.id) {
      tag = this.tagRepository.create();
      if (!tagDto.name) {
        throw new BadRequestException('Tag must have a name.');
      }
      tag.name = tagDto.name;
      await this.tagRepository.save(tag);
    } else {
      tag = await this.tagRepository.findOneBy({ id: tagDto.id });
      if (!tag) {
        throw new BadRequestException('Tag does not exist.');
      }
    }
    pin.tags = [...pin.tags, tag];
    return await this.pinRepository.save(pin);
  }

  async removeTagFromPin(pinId: number, data: RemoveTagDto[]) {
    const pin = await this.pinRepository.findOne({
      relations: {
        tags: true,
      },
      where: {
        id: pinId,
      },
      select: {
        id: true,
        tags: {
          id: true,
        },
      },
    });
    if (!pin) {
      throw new BadRequestException('Pin does not exist');
    }
    pin.tags = pin.tags.filter((t) => {
      return data.findIndex((tag) => t.id === tag.id) < 0;
    });
    return await this.pinRepository.save(pin);
  }

  async addComment(pinId: number, userId: number, comment: AddCommentDto) {
    let pin = await this.pinRepository.findOne({
      relations: {
        comments: true,
        user: true,
      },
      where: {
        id: pinId,
      },
      select: {
        id: true, url: true, thumbnail: true, fileuuid: true, name: true, createdAt: true,
        user: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
        comments: {
          content: true,
          user: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
    });
    if (!pin) {
      throw new BadRequestException('Pin does not exist');
    }
    let commentTmp: Comment;
    commentTmp = this.commentRepository.create();
    commentTmp.content = comment.content;
    const user = await this.userRepository.findOneBy({ id: userId });
    commentTmp.user = user;
    commentTmp.pin = pin;
    await this.commentRepository.save(commentTmp);
    try {
      this.pinGateway.server.emit(`${pin.user.id}`, {
        event: 'comment',
        data: {
          id: user.id,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          pinId: pin.id,
        },
      });
    } catch (err: any) {
      console.log(err);
    }
    return this.getPin(pinId);
  }
}
