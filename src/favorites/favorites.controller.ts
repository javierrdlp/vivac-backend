import {
  Controller, Post, Get, Delete, Patch, Param, Body, Req, UseGuards
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {

  constructor(private readonly favoritesService: FavoritesService) { }

  // Crear carpeta
  @Post('folders')
  @ApiOperation({
    summary: 'Crear carpeta de favoritos',
    description: 'Crea una nueva carpeta para organizar los vivacs favoritos del usuario.'
  })
  @ApiCreatedResponse({
    description: 'Carpeta creada correctamente.'
  })
  @ApiBadRequestResponse({
    description: 'El nombre de la carpeta no es válido o ya existe.'
  })
  createFolder(@Req() req, @Body() dto: CreateFolderDto) {
    return this.favoritesService.createFolder(req.user.id, dto);
  }

  // Listar carpetas
  @Get('folders')
  @ApiOperation({
    summary: 'Listar carpetas del usuario',
    description: 'Devuelve todas las carpetas de favoritos creadas por el usuario autenticado.'
  })
  @ApiOkResponse({
    description: 'Lista de carpetas devuelta correctamente.'
  })
  getFolders(@Req() req) {
    return this.favoritesService.getUserFolders(req.user.id);
  }

  // Eliminar carpeta
  @Delete('folders/:folderId')
  @ApiOperation({
    summary: 'Eliminar una carpeta',
    description: 'Elimina una carpeta de favoritos del usuario (y todos los favoritos dentro de ella).'
  })
  @ApiParam({
    name: 'folderId',
    description: 'ID de la carpeta a eliminar.'
  })
  @ApiOkResponse({
    description: 'Carpeta eliminada correctamente.'
  })
  @ApiNotFoundResponse({
    description: 'La carpeta no existe o no pertenece al usuario.'
  })
  deleteFolder(@Req() req, @Param('folderId') folderId: string) {
    return this.favoritesService.deleteFolder(req.user.id, folderId);
  }

  // Añadir vivac a una carpeta
  @Post('folders/:folderId/add/:vivacId')
  @ApiOperation({
    summary: 'Añadir vivac a una carpeta',
    description: 'Guarda un vivac como favorito dentro de una carpeta específica del usuario.'
  })
  @ApiParam({
    name: 'folderId',
    description: 'ID de la carpeta.'
  })
  @ApiParam({
    name: 'vivacId',
    description: 'ID del vivac que se desea añadir.'
  })
  @ApiCreatedResponse({
    description: 'Vivac añadido a favoritos correctamente.'
  })
  @ApiNotFoundResponse({
    description: 'La carpeta o el vivac no existen.'
  })
  addFavorite(
    @Req() req,
    @Param('folderId') folderId: string,
    @Param('vivacId') vivacId: string,
  ) {
    return this.favoritesService.addFavorite(req.user.id, folderId, vivacId);
  }

  // Listar favoritos de una carpeta
  @Get('folders/:folderId')
  @ApiOperation({
    summary: 'Obtener favoritos de una carpeta',
    description: 'Devuelve todos los vivacs guardados dentro de una carpeta del usuario.'
  })
  @ApiParam({
    name: 'folderId',
    description: 'ID de la carpeta.'
  })
  @ApiOkResponse({
    description: 'Lista de favoritos devuelta correctamente.'
  })
  @ApiNotFoundResponse({
    description: 'La carpeta no existe o no pertenece al usuario.'
  })
  getFavorites(@Req() req, @Param('folderId') folderId: string) {
    return this.favoritesService.getFavoritesInFolder(req.user.id, folderId);
  }

  // Eliminar favorito
  @Delete(':favoriteId')
  @ApiOperation({
    summary: 'Eliminar un favorito',
    description: 'Quita un vivac de la carpeta donde está guardado.'
  })
  @ApiParam({
    name: 'favoriteId',
    description: 'ID del favorito a eliminar.'
  })
  @ApiOkResponse({
    description: 'Favorito eliminado correctamente.'
  })
  @ApiNotFoundResponse({
    description: 'El favorito no existe.'
  })
  @Delete(':favoriteId')
  removeFavorite(@Req() req, @Param('favoriteId') favoriteId: string) {
    return this.favoritesService.removeFavorite(req.user.id, favoriteId);
  }

  // Mover favorito a otra carpeta
  @Patch(':favoriteId/move/:newFolderId')
  @ApiOperation({
    summary: 'Mover un favorito a otra carpeta',
    description: 'Permite reorganizar favoritos moviéndolos entre carpetas del usuario.'
  })
  @ApiParam({
    name: 'favoriteId',
    description: 'ID del favorito a mover.'
  })
  @ApiParam({
    name: 'newFolderId',
    description: 'ID de la carpeta destino.'
  })
  @ApiOkResponse({
    description: 'Favorito movido correctamente.'
  })
  @ApiNotFoundResponse({
    description: 'El favorito o la carpeta destino no existen.'
  })
  @ApiForbiddenResponse({
    description: 'La carpeta destino no pertenece al usuario.'
  })
  moveFavorite(
    @Req() req,
    @Param('favoriteId') favoriteId: string,
    @Param('newFolderId') newFolderId: string,
  ) {
    return this.favoritesService.moveFavorite(req.user.id, favoriteId, newFolderId);
  }
}
