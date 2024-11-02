import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { validateMongoId } from '../../middleware/mongoId.middleware';
import { validateData } from '../../middleware/validation.middleware';
import * as controller from './authors.controller';
import { authorCreateDtoSchema } from './dtos/author.create.dto';
import { authorUpdateDtoSchema } from './dtos/author.update.dto';

const authorsRouter = Router();

/**
 * @openapi
 * '/authors':
 *    get:
 *     tags:
 *     - Authors
 *     description: Get all Authors
 *     responses:
 *       200:
 *         description: All authors
 *    post:
 *     tags:
 *     - Authors
 *     summary: Create a Author
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/dtos/AuthorCreateDto'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthorResponse'
 *      404:
 *        description: Not Found
 *      400:
 *        description: Bad request
 */

authorsRouter.post(
  '/',
  validateData(authorCreateDtoSchema),
  expressAsyncHandler(controller.createAuthor),
);

authorsRouter.get('/', expressAsyncHandler(controller.listAuthors));

/**
 * @openapi
 * '/authors/{authorId}':
 *    get:
 *     tags:
 *     - Authors
 *     summary: Get a single Author
 *     parameters:
 *      - name: authorId
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthorResponse'
 *        404:
 *          description: Not found
 *    put:
 *     tags:
 *     - Authors
 *     summary: Update a Author
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/dtos/AuthorUpdateDto'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthorResponse'
 *      404:
 *        description: Not Found
 *      400:
 *        description: Bad request
 *    delete:
 *     tags:
 *     - Authors
 *     summary: Delete a Author
 *     parameters:
 *      - name: authorId
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *        description: Success
 *        404:
 *          description: Not found
 */

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
