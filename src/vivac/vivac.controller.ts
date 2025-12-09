import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { VivacService } from './vivac.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateVivacDto } from './dto/create-vivac.dto';
import { UpdateVivacDto } from './dto/update-vivac.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VivacPoint } from '../entities/vivac-point.entity';

@ApiTags('Vivacs')
@ApiExtraModels(CreateVivacDto, UpdateVivacDto, VivacPoint)
@Controller('vivacs')
export class VivacController {
  constructor(
    private readonly vivacService: VivacService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  // CREAR VIVAC
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo vivac (requiere autenticación)',
    description:
      'Crea un nuevo punto de vivac asociado al usuario autenticado. Debe incluir al menos nombre, coordenadas y dificultad de acceso.',
  })
  @ApiCreatedResponse({
    description: 'Vivac creado correctamente',
    type: VivacPoint,
  })
  @ApiBadRequestResponse({
    description:
      'Los datos enviados no son válidos (errores de validación en el DTO).',
  })
  @ApiUnauthorizedResponse({
    description: 'No se proporcionó un token válido.',
  })
  create(@Body() dto: CreateVivacDto, @Request() req) {
    return this.vivacService.create(dto, req.user.id);
  }

  // LISTAR VIVACS (público)
  @Get()
  @ApiOperation({
    summary: 'Listar vivacs con filtros opcionales (público)',
    description:
      'Devuelve todos los puntos de vivac. Se pueden aplicar filtros de ubicación, altitud, privacidad o dificultad.',
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    example: 38.4821,
    description: 'Latitud del punto de referencia (para filtro geográfico).',
  })
  @ApiQuery({
    name: 'lon',
    required: false,
    example: -0.4559,
    description: 'Longitud del punto de referencia (para filtro geográfico).',
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    example: 15,
    description:
      'Radio de búsqueda en kilómetros (se usa junto con lat/lon para filtro geográfico).',
  })
  @ApiQuery({
    name: 'privacity',
    required: false,
    example: 'REMOTE',
    description: 'Nivel de privacidad del vivac (REMOTE, URBAN_NEAR, etc.).',
  })
  @ApiQuery({
    name: 'accessDifficulty',
    required: false,
    example: 'MODERATE',
    description: 'Nivel de dificultad de acceso (EASY, MODERATE, HARD).',
  })
  @ApiQuery({
    name: 'minElevation',
    required: false,
    example: 400,
    description: 'Altitud mínima en metros.',
  })
  @ApiQuery({
    name: 'maxElevation',
    required: false,
    example: 1200,
    description: 'Altitud máxima en metros.',
  })
  @ApiOkResponse({
    description: 'Lista de vivacs devuelta correctamente.',
    type: VivacPoint,
    isArray: true,
  })
  findAll(@Query() filters: any) {
    return this.vivacService.findAll(filters);
  }

  // VIVACS DE UN USUARIO
  @Get('user/:userId')
  @ApiOperation({
    summary: 'Obtener todos los vivacs creados por un usuario',
    description: 'Devuelve todos los vivacs asociados a un usuario concreto.',
  })
  @ApiParam({
    name: 'userId',
    example: 'uuid-del-usuario',
    description: 'ID del usuario creador.',
  })
  @ApiOkResponse({
    description: 'Lista de vivacs del usuario devuelta correctamente.',
    type: VivacPoint,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No se encontraron vivacs para el usuario indicado.',
  })
  findByUser(@Param('userId') userId: string) {
    return this.vivacService.findByUser(userId);
  }

  // OBTENER POR ID
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un vivac por su ID',
    description:
      'Devuelve la información completa de un vivac, incluyendo usuario creador, valoraciones y si el usuario actual sigue al creador.',
  })
  @ApiParam({
    name: 'id',
    example: 'uuid-del-vivac',
    description: 'ID del vivac.',
  })
  @ApiOkResponse({
    description: 'Vivac encontrado correctamente.',
    type: VivacPoint,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningún vivac con el ID proporcionado.',
  })
  findOne(@Param('id') id: string, @Request() req) {
    const currentUserId = req.user?.id; // Puede ser undefined si no hay login
    return this.vivacService.findOne(id, currentUserId);
  }

  // ACTUALIZAR
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un vivac (solo el creador puede hacerlo)',
  })
  @ApiParam({
    name: 'id',
    example: 'uuid-del-vivac',
    description: 'ID del vivac a actualizar.',
  })
  @ApiBody({
    description: 'Campos del vivac que se desean modificar.',
    type: UpdateVivacDto,
  })
  @ApiOkResponse({
    description: 'Vivac actualizado correctamente.',
    type: VivacPoint,
  })
  @ApiBadRequestResponse({
    description:
      'Los datos enviados no son válidos (errores de validación en el DTO).',
  })
  @ApiUnauthorizedResponse({
    description: 'No se proporcionó un token válido.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no es el creador del vivac.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningún vivac con el ID proporcionado.',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVivacDto,
    @Request() req,
  ) {
    return this.vivacService.update(id, dto, req.user.id);
  }

  // ELIMINAR
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un vivac (solo el creador puede hacerlo)',
  })
  @ApiParam({
    name: 'id',
    example: 'uuid-del-vivac',
    description: 'ID del vivac a eliminar.',
  })
  @ApiOkResponse({
    description: 'Vivac eliminado correctamente.',
  })
  @ApiUnauthorizedResponse({
    description: 'No se proporcionó un token válido.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no es el creador del vivac.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningún vivac con el ID proporcionado.',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.vivacService.remove(id, req.user.id);
  }

  // SUBIR FOTOS
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/upload-photos')
  @ApiOperation({
    summary:
      'Subir una o varias imágenes al vivac (solo el creador puede hacerlo)',
    description: `
Sube 1 o varias imágenes (JPG o PNG).  
El front debe usar **multipart/form-data** con el campo **files**.

Ejemplo desde JavaScript (fetch):

const formData = new FormData();
formData.append("files", file1);
formData.append("files", file2);

fetch("https://vivac-backend-production.up.railway.app/vivacs/{id}/upload-photos", {
  method: "POST",
  headers: {
    Authorization: "Bearer TOKEN_AQUI"
    // NO poner Content-Type, lo gestiona el navegador
  },
  body: formData
});
`,
  })
  @ApiParam({
    name: 'id',
    example: '6fcfe8db-2b37-4ffd-bc3b-9b1fffa39111',
    description: 'ID del vivac al que se le subirán las imágenes.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivos de imagen a subir.',
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Imágenes subidas y asociadas al vivac correctamente.',
    schema: {
      example: {
        message: 'Se subieron 2 imagen(es) correctamente.',
        imageUrls: [
          'https://res.cloudinary.com/.../vivac/foto1.jpg',
          'https://res.cloudinary.com/.../vivac/foto2.jpg',
        ],
        vivac: {
          id: '6fcfe8db-2b37-4ffd-bc3b-9b1fffa39111',
          name: 'Refugio del Águila',
          photoUrls: [
            'https://res.cloudinary.com/.../vivac/foto1.jpg',
            'https://res.cloudinary.com/.../vivac/foto2.jpg',
          ],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No se han enviado archivos o el formato no es válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'No se proporcionó un token válido.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no es el creador del vivac.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró ningún vivac con el ID proporcionado.',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPhotos(
    @Param('id') vivacId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'Debes adjuntar al menos un archivo de imagen.',
      );
    }

    const results = await this.cloudinaryService.uploadImages(files);
    const urls = results.map((r) => r.secure_url);
    const vivac = await this.vivacService.addPhotos(
      vivacId,
      urls,
      req.user.id,
    );

    return {
      message: `Se subieron ${urls.length} imagen(es) correctamente.`,
      imageUrls: urls,
      vivac,
    };
  }

  // ELIMINAR FOTOS
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/delete-photos')
  @ApiOperation({
    summary:
      'Eliminar una o varias imágenes del vivac (solo el creador puede hacerlo)',
  })
  @ApiParam({
    name: 'id',
    example: 'uuid-del-vivac',
    description: 'ID del vivac al que pertenecen las imágenes.',
  })
  @ApiBody({
    description: 'URLs completas de las imágenes que se desean eliminar.',
    schema: {
      type: 'object',
      required: ['imageUrls'],
      properties: {
        imageUrls: {
          type: 'array',
          items: {
            type: 'string',
            example: 'https://res.cloudinary.com/.../vivac/foto.jpg',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Imágenes eliminadas correctamente.',
    schema: {
      example: {
        message: 'Se eliminaron 2 imagen(es) correctamente.',
        deleted: 2,
        vivac: {
          id: 'uuid',
          name: 'Refugio del Águila',
          photoUrls: [],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No se ha enviado ninguna URL de imagen válida.',
  })
  @ApiUnauthorizedResponse({
    description: 'No se proporcionó un token válido.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no es el creador del vivac.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró el vivac o alguna de las imágenes especificadas.',
  })
  async deletePhotos(
    @Param('id') vivacId: string,
    @Body('imageUrls') imageUrls: string[],
    @Request() req,
  ) {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new BadRequestException(
        'Debes proporcionar al menos una URL de imagen.',
      );
    }

    const publicIds = imageUrls
      .map((url) => {
        const match = url.match(/vivac\/([^/.]+)/);
        return match ? `vivac/${match[1]}` : null;
      })
      .filter(Boolean) as string[];

    if (publicIds.length === 0) {
      throw new BadRequestException(
        'Ninguna de las URLs proporcionadas parece ser válida para Cloudinary.',
      );
    }

    await this.cloudinaryService.deleteImages(publicIds);
    const vivac = await this.vivacService.removePhotos(
      vivacId,
      imageUrls,
      req.user.id,
    );

    return {
      message: `Se eliminaron ${imageUrls.length} imagen(es) correctamente.`,
      deleted: imageUrls.length,
      vivac,
    };
  }
}

