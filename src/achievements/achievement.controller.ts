import { Controller, Get, Param } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los logros del sistema (uso interno)',
    description: 'Devuelve la lista completa de logros registrados.',
  })
  @ApiResponse({ status: 200, description: 'Lista completa de logros.' })
  async getAllAchievements() {
    return this.achievementService.getAllAchievements();
  }

  @Get('users/:userId')
  @ApiOperation({
    summary: 'Obtener los logros desbloqueados por un usuario',
    description:
      'Devuelve los logros desbloqueados por un usuario concreto mediante su userId.',
  })
  @ApiResponse({ status: 200, description: 'Lista de logros del usuario.' })
  async getUserAchievements(@Param('userId') userId: string) {
    return this.achievementService.getUnlockedAchievements(userId);
  }
}
