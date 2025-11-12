import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  // Subir una imagen (función interna reutilizable)
  private async uploadSingleImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'vivac',
          resource_type: 'auto',
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: no result returned.'));
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  // Subir una o varias imágenes
  async uploadImages(files: Express.Multer.File[]): Promise<UploadApiResponse[]> {
    const results: UploadApiResponse[] = [];

    for (const file of files) {
      const result = await this.uploadSingleImage(file);
      results.push(result);
    }

    return results;
  }

  // Eliminar una imagen (función interna)
  private async deleteSingleImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // Eliminar una o varias imágenes
  async deleteImages(publicIds: string[]): Promise<any[]> {
    const results: any[] = [];

    for (const id of publicIds) {
      const result = await this.deleteSingleImage(id);
      results.push(result);
    }

    return results;
  }
}


