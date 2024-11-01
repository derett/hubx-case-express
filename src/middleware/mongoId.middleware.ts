import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ServerError, ServerErrorType } from '../shared/helpers/errors.helper';

export function validateMongoId() {
  return (req: Request, _: Response, next: NextFunction) => {
    const id = req.params.id;
    const isValid = id && mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new ServerError(ServerErrorType.INVALID_MONGO_ID, id);
    }

    next();
  };
}
