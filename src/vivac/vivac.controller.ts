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
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { VivacService } from './vivac.service';
import { CreateVivacDto } from './dto/create-vivac.dto';
import { UpdateVivacDto } from './dto/update-vivac.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Query } from '@nestjs/common';

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
  @ApiOperation({ summary: 'Listar vivacs con filtros opcionales (público)' })
  @ApiQuery({ name: 'lat', required: false, example: 38.5, description: 'Latitud de referencia para filtro por zona' })
  @ApiQuery({ name: 'lon', required: false, example: -0.4, description: 'Longitud de referencia para filtro por zona' })
  @ApiQuery({ name: 'radius', required: false, example: 15, description: 'Radio de búsqueda en km (centrado en lat/lon)' })
  //@ApiQuery({ name: 'environment', required: false, example: 'TREE_AREA,VIEWPOINT', description: 'Filtrar por entornos (valores del enum Environment, separados por coma)' })
  @ApiQuery({ name: 'privacity', required: false, example: 'REMOTE', description: 'Filtrar por tipo de privacidad (valores del enum Privacity)' })
  @ApiQuery({ name: 'accessDifficulty', required: false, example: 'MODERATE', description: 'Filtrar por dificultad de acceso (enum AccessDifficulty)' })
  @ApiQuery({ name: 'minElevation', required: false, example: 400, description: 'Altitud mínima' })
  @ApiQuery({ name: 'maxElevation', required: false, example: 1200, description: 'Altitud máxima' })
  findAll(@Query() filters: any) {
    return this.vivacService.findAll(filters);
  } 
  
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Obtener todos los vivacs creados por un usuario' })
  findByUser(@Param('userId') userId: string) {
    return this.vivacService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
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
