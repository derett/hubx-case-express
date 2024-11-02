import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { connectDB, disconnectDB } from '../src/database';
import { app } from '../src/index';
import { Author } from '../src/models/author.schema';
import { Book } from '../src/models/book.schema';
import authorsTestData from '../src/modules/authors/tests/authors.test.data';
import booksTestData from '../src/modules/books/tests/books.test.data';
import {
  ServerError,
  ServerErrorType,
} from '../src/shared/helpers/errors.helper';

const request = supertest(app);

describe('Books (e2e)', () => {
  beforeAll(async () => {
    await connectDB();

    const authors = authorsTestData.getAuthors();
    const books = booksTestData.getBooks();

    await Promise.all(authors.map((author) => Author.create(author)));
    await Promise.all(
      books.map(({ authorId, ...rest }) =>
        Book.create({ ...rest, author: authorId }),
      ),
    );
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('/books (GET)', async () => {
    await request
      .get('/books')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toEqual(booksTestData.getBooks().length);
        booksTestData.getBooks().forEach(({ authorId, ...rest }) => {
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ ...rest, author: authorId }),
            ]),
          );
        });
      });
  });

  it('/books/:id (GET)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorId, ...rest } = booksTestData.pickOne();
    await request
      .get(`/books/${rest._id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining({ ...rest }));
      });
  });

  it('/books/:id (GET) Faulty', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    await request
      .get(`/books/${id}`)
      .expect(StatusCodes.NOT_FOUND)
      .expect(({ body }) => {
        expect(body.message).toEqual(
          new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Book', id).message,
        );
      });
  });

  it('/books/ (POST)', async () => {
    const newBook = booksTestData.randomBookData();
    const { authorId, ...rest } = newBook;
    await request
      .post('/books')
      .send(newBook)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            ...rest,
            author: authorId,
            _id: expect.any(String),
            __v: expect.any(Number),
          }),
        );
      });
  });

  it('/books/ (POST) Duplicate Key Violation', async () => {
    const newBook = booksTestData.pickOne();
    await request.post('/books').send(newBook).expect(StatusCodes.BAD_REQUEST);
  });

  it('/books/ (POST) Faulty', async () => {
    const newBook = booksTestData.randomBookData();
    const faultyId = new mongoose.Types.ObjectId().toString();
    await request
      .post('/books')
      .send({ ...newBook, authorId: faultyId })
      .expect(StatusCodes.NOT_FOUND)
      .expect(({ body }) => {
        expect(body.message).toEqual(
          new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Author', faultyId)
            .message,
        );
      });
  });

  it('/books/:id (PUT)', async () => {
    const pickOne = booksTestData.pickOne();
    const newData = booksTestData.randomBookData();
    const merged = { ...pickOne, ...newData };
    const { authorId, ...rest } = merged;
    await request
      .put(`/books/${pickOne._id}`)
      .send(merged)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({ ...rest, author: authorId }),
        );
      });
  });

  it('/books/:id (PUT) Faulty', async () => {
    const pickOne = booksTestData.pickOne();
    const newData = booksTestData.randomBookData();
    const faultyId = new mongoose.Types.ObjectId().toString();
    const merged = { ...pickOne, ...newData };
    await request
      .put(`/books/${faultyId}`)
      .send(merged)
      .expect(StatusCodes.NOT_FOUND)
      .expect(({ body }) => {
        expect(body.message).toEqual(
          new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Book', faultyId)
            .message,
        );
      });
  });

  it('/books/:id (PUT) Faulty', async () => {
    const pickOne = booksTestData.pickOne();
    const newData = booksTestData.randomBookData();
    const faultyId = new mongoose.Types.ObjectId().toString();
    const merged = { ...pickOne, ...newData, authorId: faultyId };
    await request
      .put(`/books/${pickOne._id}`)
      .send(merged)
      .expect(StatusCodes.NOT_FOUND)
      .expect(({ body }) => {
        expect(body.message).toEqual(
          new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Author', faultyId)
            .message,
        );
      });
  });

  it('/books/:id (DELETE)', async () => {
    const pickOne = booksTestData.pickOne();
    await request.delete(`/books/${pickOne._id}`).expect(200);
  });
});
