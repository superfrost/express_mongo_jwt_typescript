import { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import ServerError from '../exceptions/serverError';
import { v4 as uuidv4 } from 'uuid';

export default function(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
  const errId = uuidv4()
  console.log(errId, err);
  if (err instanceof ServerError) {
    return res.status(err.status).json({message: err.message, errId, errors: err.errors})
  }
  return res.status(500).json({message: 'Unexpected error', errId})
}