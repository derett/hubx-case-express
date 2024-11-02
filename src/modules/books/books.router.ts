import { Router } from 'express';

import expressAsyncHandler from 'express-async-handler';
import { validateMongoId } from '../../middleware/mongoId.middleware';
import { validateData } from '../../middleware/validation.middleware';
import * as controller from './books.controller';
import { bookCreateDtoSchema } from './dtos/book.create.dto';
import { bookUpdateDtoSchema } from './dtos/book.update.dto';

const booksRouter = Router();

/**
 * @openapi
 * '/books':
 *    get:
 *     tags:
 *     - Books
 *     description: Get all Books
 *     responses:
 *       200:
 *         description: All books
 *    post:
 *     tags:
 *     - Books
 *     summary: Create a Book
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/dtos/BookCreateDto'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BookResponse'
 *      404:
 *        description: Not Found
 *      400:
 *        description: Bad request
 */

booksRouter.post(
  '/',
  validateData(bookCreateDtoSchema),
  expressAsyncHandler(controller.createBook),
);

booksRouter.get('/', expressAsyncHandler(controller.listBooks));

/**
 * @openapi
 * '/books/{bookId}':
 *    get:
 *     tags:
 *     - Books
 *     summary: Get a single Book
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BookResponse'
 *        404:
 *          description: Not found
 *    put:
 *     tags:
 *     - Books
 *     summary: Update a Book
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/dtos/BookUpdateDto'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BookResponse'
 *      404:
 *        description: Not Found
 *      400:
 *        description: Bad request
 *    delete:
 *     tags:
 *     - Books
 *     summary: Delete a Book
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *        description: Success
 *        404:
 *          description: Not found
 */
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
