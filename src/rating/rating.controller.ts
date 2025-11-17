import { Controller, Post, Patch, Delete, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Crear una reseña' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateRatingDto) {
    return this.ratingService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Actualizar una reseña propia' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateRatingDto) {
    return this.ratingService.update(req.user.id, id, dto);
  }

  @ApiOperation({ summary: 'Eliminar una reseña propia' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.ratingService.delete(req.user.id, id);
  }

  @ApiOperation({ summary: 'Obtener reseñas de un vivac' })
  @Get('vivac/:vivacId')
  getReviewsForVivac(@Param('vivacId') vivacId: string) {
    return this.ratingService.getReviewsForVivac(vivacId);
  }

  @ApiOperation({ summary: 'Obtener reseñas de un usuario' })
  @Get('user/:userId')
  getReviewsByUser(@Param('userId') userId: string) {
    return this.ratingService.getReviewsByUser(userId);
  }
}
