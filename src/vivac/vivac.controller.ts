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
  UploadedFile,
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
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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

  // Crear un nuevo vivac
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo vivac (requiere autenticación)' })
  create(@Body() dto: CreateVivacDto, @Request() req) {
    return this.vivacService.create(dto, req.user.id);
  }

  // Listar vivacs (público)
  @Get()
  @ApiOperation({ summary: 'Listar vivacs con filtros opcionales (público)' })
  @ApiQuery({ name: 'lat', required: false, example: 38.5 })
  @ApiQuery({ name: 'lon', required: false, example: -0.4 })
  @ApiQuery({ name: 'radius', required: false, example: 15 })
  @ApiQuery({ name: 'privacity', required: false, example: 'REMOTE' })
  @ApiQuery({ name: 'accessDifficulty', required: false, example: 'MODERATE' })
  @ApiQuery({ name: 'minElevation', required: false, example: 400 })
  @ApiQuery({ name: 'maxElevation', required: false, example: 1200 })
  findAll(@Query() filters: any) {
    return this.vivacService.findAll(filters);
  }

  // Vivacs de un usuario concreto (público o protegido, según prefieras)
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Obtener todos los vivacs creados por un usuario' })
  findByUser(@Param('userId') userId: string) {
    return this.vivacService.findByUser(userId);
  }

  // Obtener vivac por ID (público)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vivac por su ID (público)' })
  findOne(@Param('id') id: string) {
    return this.vivacService.findOne(id);
  }

  // Actualizar vivac (solo el creador)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un vivac (solo el creador puede hacerlo)' })
  update(@Param('id') id: string, @Body() dto: UpdateVivacDto, @Request() req) {
    return this.vivacService.update(id, dto, req.user.id);
  }

  // Eliminar vivac (solo el creador)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vivac (solo el creador puede hacerlo)' })
  remove(@Param('id') id: string, @Request() req) {
    return this.vivacService.remove(id, req.user.id);
  }

  // Subir foto (solo el creador)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/upload-photo')
  @ApiOperation({
    summary: 'Subir imagen al vivac (solo el creador puede hacerlo)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Subida de imagen de vivac',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Param('id') vivacId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const result = await this.cloudinaryService.uploadImage(file);
    const vivac = await this.vivacService.addPhoto(
      vivacId,
      result.secure_url,
      req.user.id,
    );
    return {
      message: 'Imagen subida correctamente',
      vivac,
      imageUrl: result.secure_url,
    };
  }

  // Eliminar foto (solo el creador)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/delete-photo')
  @ApiOperation({
    summary: 'Eliminar imagen del vivac (solo el creador puede hacerlo)',
  })
  @ApiBody({
    description: 'URL completa de la imagen a eliminar',
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          example: 'https://res.cloudinary.com/.../vivac/foto.jpg',
        },
      },
      required: ['imageUrl'],
    },
  })  
  async deletePhoto(
    @Param('id') vivacId: string,
    @Body('imageUrl') imageUrl: string,
    @Request() req,
  ) {
    if (!imageUrl) throw new Error('Falta la URL de la imagen');

    // Extraer publicId de la URL (todo después del último “/vivac/” sin extensión)
    const match = imageUrl.match(/vivac\/([^/.]+)/);
    const publicId = match ? `vivac/${match[1]}` : null;
    if (!publicId) throw new Error('No se pudo extraer el publicId de la URL');

    // Eliminar de Cloudinary
    await this.cloudinaryService.deleteImage(publicId);

    // Eliminar de la base de datos
    const vivac = await this.vivacService.removePhoto(
      vivacId,
      imageUrl,
      req.user.id,
    );

    return {
      message: 'Imagen eliminada correctamente',
      vivac,
    };
  }
}


