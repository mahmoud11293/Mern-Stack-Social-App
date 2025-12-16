import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export const imageFileInterceptor = FileInterceptor('image', {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
      cb(new Error('Only image files are allowed!'), false);
    } else {
      cb(null, true);
    }
  },
});
