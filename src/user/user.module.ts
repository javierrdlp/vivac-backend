import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { VivacPoint } from '../entities/vivac-point.entity';
import { UserFollowModule } from '../user-follow/user-follow.module';


@Module({
    imports: [TypeOrmModule.forFeature([User, VivacPoint]),
    UserFollowModule,
],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
