import { upload } from '../config/multer.js';

export const uploadMiddleware = (req, res, next) => {
    const uploadSingle = upload.single('coverImage');
    uploadSingle(req, res, next);
};
