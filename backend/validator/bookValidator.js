// import {body, validationResult} from 'express-validator';

// export const bookValidationRules = [
//     body('title').notEmpty().withMessage('Title is required'),
//     body('author').notEmpty().withMessage('Author is required'),
//     body('price').isFloat({gt: 0}).withMessage('Price must be a positive number'),
//     body('category').notEmpty().withMessage('Category is required')
// ];

// export const validateBook = (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()});
//     }

//     next();
// }

import * as z from 'zod';

export const bookSchema = z.object({
    title: z.string().nonempty({ message: "Title is required" }),
    author: z.string().nonempty({ message: "Author is required" }),
    price: z.coerce.number().positive({ message: "Price must be a positive number" }),
    category: z.string().nonempty({ message: "Category is required" }),
    coverImage: z.any().optional()
});

export const bookValidationRules = (req, res, next) => {
    try {
        const parsedData = bookSchema.parse(req.body);
        req.body = parsedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors = error.issues.map(err => ({
                field: err.path[0],
                message: err.message
            }));
            return res.status(400).json({ errors: validationErrors });
        }
        next(error); 
    }
};



