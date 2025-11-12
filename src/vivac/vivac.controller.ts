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
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VivacService } from './vivac.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateVivacDto } from './dto/create-vivac.dto';
import { UpdateVivacDto } from './dto/update-vivac.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Vivacs')
@Controller('vivacs')
export class VivacController {
  constructor(
    private readonly vivacService: VivacService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // CREAR VIVAC
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo vivac (requiere autenticación)',
    description: `Crea un nuevo punto de vivac asociado al usuario autenticado.
Debe incluir al menos nombre, coordenadas y dificultad de acceso.`,
  })
  @ApiResponse({
    status: 201,
    description: 'Vivac creado correctamente',
    schema: {
      example: {
        id: 'uuid',
        name: 'Refugio del Águila',
        latitude: 38.4821,
        longitude: -0.4559,
        elevation: 1250,
        accessDifficulty: 'MODERATE',
        privacity: 'REMOTE',
        petFriendly: true,
        createdAt: '2025-11-07T10:00:00.000Z',
        createdBy: { id: 'user-uuid', userName: 'Javi' },
      },
    },
  })
  create(@Body() dto: CreateVivacDto, @Request() req) {
    return this.vivacService.create(dto, req.user.id);
  }

  //  LISTAR VIVACS (público)
  @Get()
  @ApiOperation({
    summary: 'Listar vivacs con filtros opcionales (público)',
    description: `Devuelve todos los puntos de vivac.  
Se pueden aplicar filtros de ubicación, altitud, privacidad o dificultad.`,
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    example: 38.4821,
    description: 'Latitud del punto de referencia (para filtro geográfico)',
  })
  @ApiQuery({
    name: 'lon',
    required: false,
    example: -0.4559,
    description: 'Longitud del punto de referencia (para filtro geográfico)',
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    example: 15,
    description: 'Radio de búsqueda en kilómetros (usa lat/lon junto con este valor)',
  })
  @ApiQuery({
    name: 'privacity',
    required: false,
    example: 'REMOTE',
    description: 'Privacidad del vivac (REMOTE, URBAN, MIXED)',
  })
  @ApiQuery({
    name: 'accessDifficulty',
    required: false,
    example: 'MODERATE',
    description: 'Nivel de dificultad de acceso (EASY, MODERATE, HARD)',
  })
  @ApiQuery({
    name: 'minElevation',
    required: false,
    example: 400,
    description: 'Altitud mínima en metros',
  })
  @ApiQuery({
    name: 'maxElevation',
    required: false,
    example: 1200,
    description: 'Altitud máxima en metros',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vivacs',
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'Refugio del Águila',
          latitude: 38.4821,
          longitude: -0.4559,
          elevation: 1250,
          accessDifficulty: 'MODERATE',
          privacity: 'REMOTE',
          avgRating: 4.6,
          photoUrls: ['https://res.cloudinary.com/.../vivac/foto1.jpg'],
        },
      ],
    },
  })
  findAll(@Query() filters: any) {
    return this.vivacService.findAll(filters);
  }

  // VIVACS DE UN USUARIO
  @Get('/user/:userId')
  @ApiOperation({
    summary: 'Obtener todos los vivacs creados por un usuario',
    description: 'Devuelve todos los vivacs asociados a un usuario concreto.',
  })
  @ApiParam({ name: 'userId', example: 'uuid-del-usuario' })
  findByUser(@Param('userId') userId: string) {
    return this.vivacService.findByUser(userId);
  }

  // OBTENER POR ID
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un vivac por su ID',
    description: 'Devuelve la información completa de un vivac, incluyendo usuario creador y valoraciones.',
  })
  @ApiParam({ name: 'id', example: 'uuid-del-vivac' })
  @ApiResponse({
    status: 200,
    description: 'Vivac encontrado',
    schema: {
      example: {
        id: 'uuid',
        name: 'Refugio del Águila',
        description: 'Pequeño refugio de piedra cerca del pico del Águila',
        elevation: 1250,
        privacity: 'REMOTE',
        photoUrls: ['https://res.cloudinary.com/.../vivac/foto1.jpg'],
        createdBy: { id: 'user-uuid', userName: 'Javi' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.vivacService.findOne(id);
  }

  // ACTUALIZAR
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un vivac (solo el creador puede hacerlo)' })
  @ApiParam({ name: 'id', example: 'uuid-del-vivac' })
  @ApiBody({
    description: 'Campos del vivac que se desean modificar',
    type: UpdateVivacDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateVivacDto, @Request() req) {
    return this.vivacService.update(id, dto, req.user.id);
  }

  // ELIMINAR
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vivac (solo el creador puede hacerlo)' })
  @ApiParam({ name: 'id', example: 'uuid-del-vivac' })
  remove(@Param('id') id: string, @Request() req) {
    return this.vivacService.remove(id, req.user.id);
  }

  // SUBIR FOTOS
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/upload-photos')
  @ApiOperation({
    summary: 'Subir una o varias imágenes al vivac (solo el creador puede hacerlo)',
    description: `Adjunta una o varias imágenes (máximo recomendado 5) 
en formato JPEG o PNG. Se guardarán en Cloudinary y se asociarán al vivac.`,
  })
  @ApiParam({ name: 'id', example: 'uuid-del-vivac' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivos de imagen a subir',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imágenes subidas correctamente',
    schema: {
      example: {
        message: 'Se subieron 2 imagen(es) correctamente.',
        imageUrls: [
          'https://res.cloudinary.com/.../vivac/foto1.jpg',
          'https://res.cloudinary.com/.../vivac/foto2.jpg',
        ],
        vivac: {
          id: 'uuid',
          name: 'Refugio del Águila',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPhotos(
    @Param('id') vivacId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    const results = await this.cloudinaryService.uploadImages(files);
    const urls = results.map((r) => r.secure_url);
    const vivac = await this.vivacService.addPhotos(vivacId, urls, req.user.id);
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
    summary: 'Eliminar una o varias imágenes del vivac (solo el creador puede hacerlo)',
  })
  @ApiParam({ name: 'id', example: 'uuid-del-vivac' })
  @ApiBody({
    description: 'URLs completas de las imágenes que se desean eliminar',
    schema: {
      type: 'object',
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
  @ApiResponse({
    status: 200,
    description: 'Imágenes eliminadas correctamente',
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
  async deletePhotos(
    @Param('id') vivacId: string,
    @Body('imageUrls') imageUrls: string[],
    @Request() req,
  ) {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('Debes proporcionar al menos una URL de imagen');
    }

    const publicIds = imageUrls
      .map((url) => {
        const match = url.match(/vivac\/([^/.]+)/);
        return match ? `vivac/${match[1]}` : null;
      })
      .filter(Boolean) as string[];

    await this.cloudinaryService.deleteImages(publicIds);
    const vivac = await this.vivacService.removePhotos(vivacId, imageUrls, req.user.id);

    return {
      message: `Se eliminaron ${imageUrls.length} imagen(es) correctamente.`,
      deleted: imageUrls.length,
      vivac,
    };
  }
}


