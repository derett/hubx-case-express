import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { connectDB, disconnectDB } from '../src/database';
import { app } from '../src/index';
import { Author } from '../src/models/author.schema';
import authorsTestData from '../src/modules/authors/tests/authors.test.data';
import {
  ServerError,
  ServerErrorType,
} from '../src/shared/helpers/errors.helper';

const request = supertest(app);

describe('Authors (e2e)', () => {
  beforeAll(async () => {
    await connectDB();

    const authors = authorsTestData.getAuthors();
    await Promise.all(authors.map((author) => Author.create(author)));
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('/authors (GET)', async () => {
    await request
      .get('/authors')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toEqual(authorsTestData.getAuthors().length);
        authorsTestData.getAuthors().forEach((author) => {
          expect(body).toEqual(
            expect.arrayContaining([expect.objectContaining(author)]),
          );
        });
      });
  });

  it('/authors/:id (GET)', async () => {
    const pickOne = authorsTestData.pickOne();
    await request
      .get(`/authors/${pickOne._id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(pickOne));
      });
  });

  it('/authors/:id (GET) Faulty', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    await request
      .get(`/authors/${id}`)
      .expect(StatusCodes.NOT_FOUND)
      .expect(({ body }) => {
        expect(body.message).toEqual(
          new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Author', id).message,
        );
      });
  });

  it('/authors/ (POST)', async () => {
    const newAuthor = authorsTestData.randomAuthorData();
    await request
      .post('/authors')
      .send(newAuthor)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            ...newAuthor,
            _id: expect.any(String),
            __v: expect.any(Number),
          }),
        );
      });
  });

  it('/authors/:id (PUT)', async () => {
    const pickOne = authorsTestData.pickOne();
    const newData = authorsTestData.randomAuthorData();
    const merged = { ...pickOne, ...newData };
    await request
      .put(`/authors/${pickOne._id}`)
      .send(merged)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(merged));
      });
  });

  it('/authors/:id (PUT) Faulty', async () => {
    const pickOne = authorsTestData.pickOne();
    const newData = authorsTestData.randomAuthorData();
    const faultyId = new mongoose.Types.ObjectId().toString();
    const merged = { ...pickOne, ...newData };
    await request
      .put(`/authors/${faultyId}`)
      .send(merged)
      .expect(StatusCodes.NOT_FOUND)
      .expect(({ body }) => {
        expect(body.message).toEqual(
          new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Author', faultyId)
            .message,
        );
      });
  });

  it('/authors/:id (DELETE)', async () => {
    const pickOne = authorsTestData.pickOne();
    await request.delete(`/authors/${pickOne._id}`).expect(200);
  });
});
