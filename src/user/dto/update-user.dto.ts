import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsEnum, IsUrl } from 'class-validator';
import { UserExperience } from 'src/enums/user-experience.enum';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'JaviDev' })
    @IsOptional()
    @IsString()
    @Length(3, 50)
    userName?: string;

    @ApiPropertyOptional({ example: 'Amante del senderismo y la montaña' })
    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string;

    @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...jpg' })
    @IsOptional()
    @IsUrl()
    avatarUrl?: string;

    @ApiPropertyOptional({ enum: UserExperience })
    @IsOptional()
    @IsEnum(UserExperience)
    userExperience?: UserExperience;
}
