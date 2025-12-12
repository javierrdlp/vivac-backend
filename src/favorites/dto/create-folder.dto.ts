import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'Mis vivacs de Pirineos' })
  @IsString()
  @Length(1, 100)
  name: string;
}
