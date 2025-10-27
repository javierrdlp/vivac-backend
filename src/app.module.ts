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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:UfAwAazKXvllne5Z@db.cycopkapgabeydknnyhj.supabase.co:5432/postgres',
      synchronize: true, // dejar activado solo durante desarrollo
      schema: 'public',
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true, // detecta entidades usadas en los módulos
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
    ]), AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


