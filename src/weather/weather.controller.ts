import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { WeatherResponseDto } from './dto/weather-response.dto';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({
    summary: 'Obtener el clima actual',
    description:
      'Devuelve el clima actual consultando WeatherAPI en base a latitud y longitud.',
  })
  @ApiQuery({
    name: 'lat',
    required: true,
    example: 38.4821,
    description: 'Latitud del punto vivac',
  })
  @ApiQuery({
    name: 'lon',
    required: true,
    example: -0.4559,
    description: 'Longitud del punto vivac',
  })
  @ApiResponse({
    status: 200,
    description: 'Clima obtenido correctamente',
    type: WeatherResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error al consultar WeatherAPI',
  })
  async getCurrentWeather(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
  ) {
    return this.weatherService.getCurrentWeather(lat, lon);
  }
}
