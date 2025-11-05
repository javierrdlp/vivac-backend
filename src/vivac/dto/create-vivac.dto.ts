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
import { AccessDifficulty } from '../../enums/access-difficulty.enum';
import { Environment } from '../../enums/environment.enum';
import { Privacity } from '../../enums/privacity.enum';
import { TerrainType } from '../../enums/terrain-type.enum';

export class CreateVivacDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsOptional()
  @IsNumber()
  elevation?: number;

  @IsEnum(AccessDifficulty)
  accessDifficulty: AccessDifficulty;

  @IsOptional()
  @IsEnum(Environment, { each: true })
  @IsArray()
  environment?: Environment;

  @IsOptional()
  @IsEnum(Privacity)
  privacity?: Privacity;

  @IsOptional()
  @IsEnum(TerrainType)
  terrainType?: TerrainType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @IsOptional()
  @IsBoolean()
  petFriendly?: boolean;
}
