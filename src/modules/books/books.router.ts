import { Router } from 'express';

import expressAsyncHandler from 'express-async-handler';
import { validateMongoId } from '../../middleware/mongoId.middleware';
import { validateData } from '../../middleware/validation.middleware';
import * as controller from './books.controller';
import { bookCreateDtoSchema } from './dtos/book.create.dto';
import { bookUpdateDtoSchema } from './dtos/book.update.dto';

const booksRouter = Router();

booksRouter.post(
  '/',
  validateData(bookCreateDtoSchema),
  expressAsyncHandler(controller.createBook),
);

booksRouter.get('/', expressAsyncHandler(controller.listBooks));

booksRouter.get(
  '/:id',
  validateMongoId(),
  expressAsyncHandler(controller.findBook),
);

booksRouter.put(
  '/:id',
  validateMongoId(),
  validateData(bookUpdateDtoSchema),
  expressAsyncHandler(controller.updateBook),
);

booksRouter.delete(
  '/:id',
  validateMongoId(),
  expressAsyncHandler(controller.deleteBook),
);

export default booksRouter;
