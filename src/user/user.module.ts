import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { VivacPoint } from 'src/entities/vivac-point.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, VivacPoint])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
