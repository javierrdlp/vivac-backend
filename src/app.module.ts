import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { VivacPoint } from './entities/vivac-point.entity';
import { Group } from './entities/group.entity';
import { GroupMessage } from './entities/group-message.entity';
import { Rating } from './entities/rating.entity';
import { UserFollow } from './entities/user-follow.entity';
import { UserGroup } from './entities/user-group.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { Achievement } from './entities/achievement.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve, join } from 'path';
import { VivacModule } from './vivac/vivac.module';
import { ImageModule } from './image/image.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserModule } from './user/user.module';
import { RatingModule } from './rating/rating.module';
import { WeatherModule } from './weather/weather.module';
import { AchievementSeeder } from './achievements/achievement.seed';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserFollowModule } from './user-follow/user-follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '..', '.env'),
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      schema: 'public',
      autoLoadEntities: true,
      ssl: process.env.DATABASE_URL?.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    }),

    TypeOrmModule.forFeature([
      User,
      VivacPoint,
      Group,
      GroupMessage,
      Rating,
      UserFollow,
      UserGroup,
      UserAchievement,
      Achievement,
    ]),

    AuthModule,
    VivacModule,
    ImageModule,
    CloudinaryModule,
    UserModule,
    RatingModule,
    WeatherModule,
    UserFollowModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}




