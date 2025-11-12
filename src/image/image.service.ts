import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ImageService {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  async uploadImages(files: Express.Multer.File[]): Promise<{ urls: string[]; results: UploadApiResponse[] }> {

    const results = await this.cloudinaryService.uploadImages(files);
    // Extraemos solo las URLs seguras
    const urls = results.map((r) => r.secure_url);

    return { urls, results };
  }
}
