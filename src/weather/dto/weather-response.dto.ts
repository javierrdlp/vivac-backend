import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({
    example: 'Alicante',
    description: 'Nombre de la ubicación proporcionada por WeatherAPI.',
  })
  location: string;

  @ApiProperty({
    example: 'Comunitat Valenciana',
    description: 'Región donde se encuentra la ubicación.',
  })
  region: string;

  @ApiProperty({
    example: 'Spain',
    description: 'País donde se encuentra la ubicación.',
  })
  country: string;

  @ApiProperty({
    example: 22.5,
    description: 'Temperatura actual en grados Celsius.',
  })
  temperature: number;

  @ApiProperty({
    example: 21.8,
    description: 'Sensación térmica real en grados Celsius.',
  })
  feelsLike: number;

  @ApiProperty({
    example: 'Cielo despejado',
    description: 'Descripción del estado del clima.',
  })
  condition: string;

  @ApiProperty({
    example: '//cdn.weatherapi.com/weather/64x64/day/113.png',
    description: 'URL del icono representativo del clima.',
  })
  icon: string;

  @ApiProperty({
    example: 15.5,
    description: 'Velocidad del viento en km/h.',
  })
  windKph: number;

  @ApiProperty({
    example: 55,
    description: 'Porcentaje de humedad en el aire.',
  })
  humidity: number;

  @ApiProperty({
    example: 0.0,
    description: 'Cantidad de lluvia en mm.',
  })
  precipMm: number;

  @ApiProperty({
    example: 10,
    description: 'Porcentaje de nubosidad.',
  })
  cloud: number;

  @ApiProperty({
    example: 4.0,
    description: 'Índice UV actual.',
  })
  uv: number;

  @ApiProperty({
    example: '2025-01-20 14:00',
    description: 'Fecha y hora de la última actualización.',
  })
  lastUpdated: string;
}
