import { Controller, Get, Patch, Delete, UseGuards, Request, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Obtener mi perfil' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    getMe(@Request() req) {
        return this.userService.findById(req.user.id, true);
    }

    @ApiOperation({ summary: 'Actualizar mi perfil' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('me')
    updateMe(@Request() req, @Body() dto: UpdateUserDto) {
        return this.userService.update(req.user.id, dto);
    }

    @ApiOperation({ summary: 'Eliminar mi cuenta' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('me')
    deleteMe(@Request() req) {
        return this.userService.delete(req.user.id);
    }

    @ApiOperation({ summary: 'Obtener el perfil público de un usuario' })
    @Get(':id')
    getPublicProfile(@Param('id') id: string) {
        return this.userService.getPublicProfile(id);
    }

}
