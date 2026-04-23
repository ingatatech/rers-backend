import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Readable } from 'stream';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
  /**
   * Upload a file buffer to Cloudinary.
   * Returns the secure URL and public_id of the uploaded asset.
   */
  async upload(
    buffer: Buffer,
    options: {
      folder?: string;
      publicId?: string;
      resourceType?: 'image' | 'video' | 'raw' | 'auto';
      originalName?: string;
    } = {},
  ): Promise<{ url: string; publicId: string }> {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: options.folder ?? 'rers/documents',
          public_id: options.publicId,
          resource_type: options.resourceType ?? 'auto',
          use_filename: true,
          unique_filename: true,
          // Preserve original name in metadata for searchability
          context: options.originalName
            ? { original_name: options.originalName }
            : undefined,
        },
        (error, result) => {
          if (error || !result) {
            reject(
              new InternalServerErrorException(
                error?.message ?? 'Cloudinary upload failed',
              ),
            );
          } else {
            resolve(result);
          }
        },
      );
      Readable.from(buffer).pipe(upload);
    });

    return { url: result.secure_url, publicId: result.public_id };
  }

  /**
   * Delete an asset from Cloudinary by its public_id.
   */
  async delete(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}
