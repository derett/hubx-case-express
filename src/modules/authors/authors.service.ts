import { Author } from '../../models/author.schema';
import {
  ServerError,
  ServerErrorType,
} from '../../shared/helpers/errors.helper';
import mongoErrorHandler from '../../shared/helpers/mongo.error.handler';
import { AuthorCreateDto } from './dtos/author.create.dto';
import { AuthorUpdateDto } from './dtos/author.update.dto';

export const createAuthor = async (body: AuthorCreateDto) => {
  try {
    // Create an author
    const author = await Author.create(body);
    return author;
  } catch (e) {
    mongoErrorHandler(e);
    throw e;
  }
};

export const findAuthor = async (id: string) => {
  let author;

  try {
    // try to find the author by id and populate books, throw not found error if it fails
    author = await Author.findById(id)?.populate(['books']);
    if (!author) {
      throw new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Author', id);
    }
  } catch (e) {
    throw e;
  }

  return author;
};

export const listAuthors = async () => {
  // List all the authors
  const authors = await Author.find();
  return authors;
};

export const updateAuthor = async (id: string, body: AuthorUpdateDto) => {
  try {
    // Try to update authors, if returning model is null throw error
    const model = await Author.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!model) {
      throw new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Author', id);
    }

    return model;
  } catch (e) {
    mongoErrorHandler(e);
    throw e;
  }
};

export const deleteAuthor = async (id: string) => {
  await Author.deleteOne({ _id: id });
};
