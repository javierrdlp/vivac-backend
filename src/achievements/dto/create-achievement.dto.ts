import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateAchievementDto {
  @ApiProperty({ example: 'Primer Vivac' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Creaste tu primer punto de vivac en la aplicación.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://miweb.com/icons/primer-vivac.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  xpReward: number;
}
