import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VivacPoint } from '../entities/vivac-point.entity';
import { User } from '../entities/user.entity';
import { VivacService } from './vivac.service';
import { VivacController } from './vivac.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VivacPoint, User])],
  controllers: [VivacController],
  providers: [VivacService],
})
export class VivacModule {}
