import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { WeatherForecastDto } from './dto/weather-forecast.dto';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  // Clima actual
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

  // Previsión días y horas 
  @Get('forecast')
  @ApiOperation({
    summary: 'Obtener previsión meteorológica',
    description:
      'Devuelve previsión meteorológica por días y por horas usando WeatherAPI. El plan Free permite un máximo de 3 días.',
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
  @ApiQuery({
    name: 'days',
    required: false,
    example: 3,
    description: 'Número de días de previsión (máximo 3 con el plan Free)',
  })
  @ApiResponse({
    status: 200,
    description: 'Previsión obtenida correctamente',
    type: WeatherForecastDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error al consultar WeatherAPI',
  })
  async getForecast(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('days') days: number = 3,
  ) {
    return this.weatherService.getForecast(lat, lon, days);
  }
}
