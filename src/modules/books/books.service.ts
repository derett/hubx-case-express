import { Author } from '../../models/author.schema';
import { Book } from '../../models/book.schema';
import {
  ServerError,
  ServerErrorType,
} from '../../shared/helpers/errors.helper';
import mongoErrorHandler from '../../shared/helpers/mongo.error.handler';
import { BookCreateDto } from './dtos/book.create.dto';
import { BookUpdateDto } from './dtos/book.update.dto';

export const createBook = async ({ authorId, ...bookDto }: BookCreateDto) => {
  // Tries to find an author entity by given Id, throws error if it fails to find
  const author = await Author.findById(authorId);
  if (!author)
    throw new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Author', authorId);

  try {
    // Create a book with Author reference
    const book = await Book.create({
      ...bookDto,
      author: author._id,
    });

    // Push newly created book to authors array
    await author.updateOne({
      $push: {
        books: book._id,
      },
    });

    return book;
  } catch (e) {
    mongoErrorHandler(e);
    throw e;
  }
};

export const findBook = async (id: string) => {
  let book;

  try {
    // try to find the book by id and populate author, throw not found error if it fails
    book = await Book.findById(id)?.populate(['author']);
    if (!book) {
      throw new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Book', id);
    }
  } catch (e) {
    throw e;
  }

  return book;
};

export const listBooks = async () => {
  // List all the books
  const books = await Book.find();
  return books;
};

export const updateBook = async (id: string, body: BookUpdateDto) => {
  // If an authorId is provided (assuming that we allow author of the book can be changed) check if the author exists
  if (body.authorId) {
    const author = await Author.findById(body.authorId);
    if (!author)
      throw new ServerError(
        ServerErrorType.WAS_NOT_FOUND,
        'Author',
        body.authorId,
      );
  }

  try {
    const updateBody = { ...body };
    // Populate author property if the authorId is provided and valid
    if (body.authorId) updateBody['author'] = body.authorId;

    const bookToUpdate = await Book.findById(id);
    if (!bookToUpdate) {
      throw new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Book', id);
    }

    const currentAuthorId = bookToUpdate.author;

    // Try to update book, if returning model is null throw error
    const model = await Book.findByIdAndUpdate(id, updateBody, {
      new: true,
    });

    // If request tries to update author of the book. Remove book from the current authors list and add to new authors list
    if (body.authorId && currentAuthorId) {
      await Author.findByIdAndUpdate(currentAuthorId, {
        $pull: { books: id },
      });

      await Author.findByIdAndUpdate(body.authorId, {
        $addToSet: { books: id },
      });
    }

    if (!model) {
      throw new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Book', id);
    }

    return model;
  } catch (e) {
    mongoErrorHandler(e);
    throw e;
  }
};

export const deleteBook = async (id: string) => {
  // Find book to be deleted
  const book = await Book.findById(id);
  if (!book) {
    throw new ServerError(ServerErrorType.WAS_NOT_FOUND, 'Book', id);
  }

  // Delete book
  await Book.deleteOne({ _id: id });

  // Remove the book ID from the author's books array
  await Author.findByIdAndUpdate(book.author, {
    $pull: { books: id },
  });
};
