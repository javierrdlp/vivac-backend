import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, description: 'Puntuación 1-5 estrellas' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Lugar increíble para vivaquear', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: 'uuid-del-vivac' })
  vivacId: string;
}
