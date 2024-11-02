import { Request, Response } from 'express';

import * as service from './authors.service';

export const createAuthor = async (req: Request, res: Response) => {
  const author = await service.createAuthor(req.body);
  res.status(201).json(author);
};

export const listAuthors = async (_: Request, res: Response) => {
  const authors = await service.listAuthors();
  res.json(authors);
};

export const findAuthor = async (req: Request, res: Response) => {
  const author = await service.findAuthor(req.params.id);
  res.json(author);
};

export const updateAuthor = async (req: Request, res: Response) => {
  const author = await service.updateAuthor(req.params.id, req.body);
  res.json(author);
};

export const deleteAuthor = async (req: Request, res: Response) => {
  const result = await service.deleteAuthor(req.params.id);
  res.json(result);
};
