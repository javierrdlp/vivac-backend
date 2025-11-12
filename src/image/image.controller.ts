import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Subir una o varias imágenes a Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Una o varias imágenes a subir',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imágenes subidas correctamente',
    schema: {
      example: {
        message: '3 imágenes subidas correctamente',
        urls: [
          'https://res.cloudinary.com/tucloud/image/upload/v123456/vivac/foto1.jpg',
          'https://res.cloudinary.com/tucloud/image/upload/v123456/vivac/foto2.jpg',
          'https://res.cloudinary.com/tucloud/image/upload/v123456/vivac/foto3.jpg',
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error al subir las imágenes',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const { urls } = await this.imageService.uploadImages(files);

    return {
      message: `${urls.length} imagen(es) subida(s) correctamente`,
      urls,
    };
  }

}

