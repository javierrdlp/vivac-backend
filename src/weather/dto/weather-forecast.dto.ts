import { ApiProperty } from '@nestjs/swagger';

export class WeatherForecastDto {
  @ApiProperty({ example: 'Alicante' })
  location: string;

  @ApiProperty({ example: 'Comunitat Valenciana' })
  region: string;

  @ApiProperty({ example: 'Spain' })
  country: string;

  @ApiProperty({
    description: 'Lista de predicciones por día. Máximo 3 días en plan Free.',
    type: () => [WeatherForecastDay],
  })
  forecast: WeatherForecastDay[];
}

export class WeatherForecastDay {
  @ApiProperty({ example: '2025-01-20' })
  date: string;

  @ApiProperty({ example: 22.5 })
  maxTemp: number;

  @ApiProperty({ example: 14.2 })
  minTemp: number;

  @ApiProperty({ example: 18.3 })
  avgTemp: number;

  @ApiProperty({ example: 'Cielo parcialmente nublado' })
  condition: string;

  @ApiProperty({ example: '//cdn.weatherapi.com/weather/64x64/day/116.png' })
  icon: string;

  @ApiProperty({ example: 18.0 })
  maxWind: number;

  @ApiProperty({ example: 0.6 })
  totalPrecip: number;

  @ApiProperty({ example: 5 })
  uv: number;

  @ApiProperty({
    description: 'Predicción horaria para este día',
    type: () => [WeatherForecastHour],
  })
  hours: WeatherForecastHour[];
}

export class WeatherForecastHour {
  @ApiProperty({ example: '2025-01-20 14:00' })
  time: string;

  @ApiProperty({ example: 18.5 })
  temp: number;

  @ApiProperty({ example: 17.9 })
  feelsLike: number;

  @ApiProperty({ example: 'Cielo despejado' })
  condition: string;

  @ApiProperty({
    example: '//cdn.weatherapi.com/weather/64x64/day/113.png',
  })
  icon: string;

  @ApiProperty({ example: 12.3 })
  windKph: number;

  @ApiProperty({ example: 55 })
  humidity: number;

  @ApiProperty({ example: 0.0 })
  precipMm: number;

  @ApiProperty({ example: 10 })
  chanceOfRain: number;

  @ApiProperty({ example: 20 })
  cloud: number;
}
