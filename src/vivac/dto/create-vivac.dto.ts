import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsLatitude,
  IsLongitude,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccessDifficulty } from '../../enums/access-difficulty.enum';
import { Environment } from '../../enums/environment.enum';
import { Privacity } from '../../enums/privacity.enum';
import { TerrainType } from '../../enums/terrain-type.enum';

export class CreateVivacDto {
  @ApiProperty({
    example: 'Refugio del Águila',
    description: 'Nombre del vivac',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'Pequeño refugio de piedra cerca del pico del Águila',
    description: 'Descripción opcional del vivac',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 38.4821,
    description: 'Latitud del vivac en grados decimales',
  })
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    example: -0.4559,
    description: 'Longitud del vivac en grados decimales',
  })
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({
    example: 1250,
    description: 'Altitud del vivac en metros sobre el nivel del mar',
  })
  @IsOptional()
  @IsNumber()
  elevation?: number;

  @ApiProperty({
    example: AccessDifficulty.MODERATE,
    enum: AccessDifficulty,
    description: 'Nivel de dificultad de acceso al vivac',
  })
  @IsEnum(AccessDifficulty)
  accessDifficulty: AccessDifficulty;

  @ApiPropertyOptional({
    example: [Environment.BRIDGE, Environment.SHELTER],
    enum: Environment,
    isArray: true,
    description: 'Tipo de entorno natural en el que se encuentra el vivac',
  })
  @IsOptional()
  @IsEnum(Environment, { each: true })
  @IsArray()
  environment?: Environment[];

  @ApiPropertyOptional({
    example: Privacity.URBAN_NEAR,
    enum: Privacity,
    description: 'Nivel de privacidad del vivac (público, privado o de grupo)',
  })
  @IsOptional()
  @IsEnum(Privacity)
  privacity?: Privacity;

  @ApiPropertyOptional({
    example: TerrainType.ROCKY,
    enum: TerrainType,
    description: 'Tipo de terreno donde se ubica el vivac',
  })
  @IsOptional()
  @IsEnum(TerrainType)
  terrainType?: TerrainType;

  @ApiPropertyOptional({
    example: [
      'https://res.cloudinary.com/demo/image/upload/v1234567890/vivac1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1234567890/vivac2.jpg',
    ],
    description: 'Lista de URLs de fotos asociadas al vivac',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si se permiten mascotas en el vivac',
  })
  @IsOptional()
  @IsBoolean()
  petFriendly?: boolean;
}

