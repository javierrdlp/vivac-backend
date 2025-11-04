import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VivacService } from './vivac.service';
import { CreateVivacDto } from './dto/create-vivac.dto';
import { UpdateVivacDto } from './dto/update-vivac.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('vivacs')
export class VivacController {
  constructor(private readonly vivacService: VivacService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateVivacDto, @Request() req) {
    return this.vivacService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.vivacService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vivacService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVivacDto) {
    return this.vivacService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vivacService.remove(id);
  }

  @Get('/user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.vivacService.findByUser(userId);
  }
}
