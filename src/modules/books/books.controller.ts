import { Request, Response } from 'express';

import * as service from './books.service';

export const createBook = async (req: Request, res: Response) => {
  const book = await service.createBook(req.body);
  res.status(201).json(book);
};

export const listBooks = async (_: Request, res: Response) => {
  const books = await service.listBooks();
  res.json(books);
};

export const findBook = async (req: Request, res: Response) => {
  const book = await service.findBook(req.params.id);
  res.json(book);
};

export const updateBook = async (req: Request, res: Response) => {
  const book = await service.updateBook(req.params.id, req.body);
  res.json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
  res.json(await service.deleteBook(req.params.id));
};
