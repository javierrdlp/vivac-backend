import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) { }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los logros disponibles',
    description:
      'Devuelve la lista completa de logros creados por el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logros devuelta correctamente.',
  })
  async getAllAchievements() {
    return this.achievementService.getAllAchievements();
  }

  // Crear un logro nuevo  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo logro',
    description: 'Crea un logro personalizado en el sistema.',
  })
  @ApiResponse({ status: 201, description: 'Logro creado correctamente.' })
  async createAchievement(@Body() dto: CreateAchievementDto) {
    return this.achievementService.createAchievement(dto);
  }

  // Logros desbloqueados por un usuario  
  @Get('users/:userId')
  @ApiOperation({
    summary: 'Obtener logros desbloqueados por un usuario',
    description:
      'Devuelve los logros que el usuario ha desbloqueado, ordenados por fecha.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logros del usuario.',
  })
  async getUserAchievements(@Param('userId') userId: string) {
    return this.achievementService.getUserAchievements(userId);
  }
}
