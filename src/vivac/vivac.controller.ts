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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VivacService } from './vivac.service';
import { CreateVivacDto } from './dto/create-vivac.dto';
import { UpdateVivacDto } from './dto/update-vivac.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Vivacs')
@ApiBearerAuth()
@Controller('vivacs')
export class VivacController {
  constructor(private readonly vivacService: VivacService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo vivac (requiere autenticación)' })
  create(@Body() dto: CreateVivacDto, @Request() req) {
    return this.vivacService.create(dto, req.user.id);
  }
  
  @Get()
  @ApiOperation({ summary: 'Obtener todos los vivacs disponibles' })
  findAll() {
    return this.vivacService.findAll();
  }
  
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Obtener todos los vivacs creados por un usuario' })
  findByUser(@Param('userId') userId: string) {
    return this.vivacService.findByUser(userId);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vivac por su ID' })
  findOne(@Param('id') id: string) {
    return this.vivacService.findOne(id);
  }
 
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un vivac existente' })
  update(@Param('id') id: string, @Body() dto: UpdateVivacDto) {
    return this.vivacService.update(id, dto);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vivac' })
  remove(@Param('id') id: string) {
    return this.vivacService.remove(id);
  }
}
