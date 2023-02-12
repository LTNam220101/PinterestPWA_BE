import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { BoardModule } from './board/board.module';
import { PinModule } from './pin/pin.module';
import { PaginationModule } from './pagination/pagination.module';
import { TagModule } from './tag/tag.module';
import { ThumbnailModule } from './thumbnail/thumbnail.module';
import { SearchModule } from './search/search.module';
import { AppController } from './app.controller';
import { UpdatesModule } from './updates/updates.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres',
          ssl: true,
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UserModule,
    AuthModule,
    FirebaseModule,
    BoardModule,
    PinModule,
    TagModule,
    PaginationModule,
    ThumbnailModule,
    SearchModule,
    UpdatesModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
