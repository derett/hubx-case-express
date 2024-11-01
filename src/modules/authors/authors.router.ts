import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { validateMongoId } from '../../middleware/mongoId.middleware';
import { validateData } from '../../middleware/validation.middleware';
import * as controller from './authors.controller';
import { authorCreateDtoSchema } from './dtos/author.create.dto';
import { authorUpdateDtoSchema } from './dtos/author.update.dto';

const authorsRouter = Router();

authorsRouter.post(
  '/',
  validateData(authorCreateDtoSchema),
  expressAsyncHandler(controller.createAuthor),
);

authorsRouter.get('/', expressAsyncHandler(controller.listAuthors));

authorsRouter.get(
  '/:id',
  validateMongoId(),
  expressAsyncHandler(controller.findAuthor),
);

authorsRouter.put(
  '/:id',
  validateMongoId(),
  validateData(authorUpdateDtoSchema),
  expressAsyncHandler(controller.updateAuthor),
);

authorsRouter.delete(
  '/:id',
  validateMongoId(),
  expressAsyncHandler(controller.deleteAuthor),
);

export default authorsRouter;
