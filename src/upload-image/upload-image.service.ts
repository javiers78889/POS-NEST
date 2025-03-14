import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './upload-image.response';
const streamifier = require('streamifier')


@Injectable()
export class UploadImageService {

    uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {

        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const UploadImage = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error)
                    if (result) resolve(result)

                }
            )

            streamifier.createReadStream(file.buffer).pipe(UploadImage)
        })
    }
}
