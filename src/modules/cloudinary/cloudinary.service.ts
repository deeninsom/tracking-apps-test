import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async uploadImage(imageFile: Express.Multer.File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const publicId = `image_${timestamp}_${randomString}`;

      const imageBuffer = imageFile.buffer.toString('base64');
      v2.uploader.upload(
        `data:${imageFile.mimetype};base64,${imageBuffer}`,
        { public_id: publicId, folder: 'files', resource_type: 'auto' }, // Use the generated public_id
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );
    });
  }
}
