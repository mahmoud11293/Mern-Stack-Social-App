import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    options?: UploadApiOptions,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      if (file.buffer) {
        const uploadStream = cloudinary.uploader.upload_stream(
          options || {},
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else if (file.path && fs.existsSync(file.path)) {
        cloudinary.uploader.upload(
          file.path,
          options || {},
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
            fs.unlinkSync(file.path);
          },
        );
      } else {
        reject(new Error('No valid file buffer or path found.'));
      }
    });
  }

  async deleteFolderWithResources(folderPath: string): Promise<void> {
    try {
      // Delete all resources in the folder
      await cloudinary.api.delete_resources_by_prefix(folderPath);

      // Delete the folder
      await cloudinary.api.delete_folder(folderPath);
    } catch (error) {
      console.error('Error deleting Cloudinary folder and resources:', error);
      throw error;
    }
  }
}
