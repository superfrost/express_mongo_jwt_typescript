import dotenv from 'dotenv'
dotenv.config()
import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken';
import ServerError from "../exceptions/serverError";
const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS as string;

export interface UserRequest extends Request {
  userId: string;
}

interface jsonUserData {
  id: string;
}

function isAuth(req: UserRequest, res: Response, next: NextFunction): void {
  try {
    const bearer = req.headers.authorization as string
    if (!bearer) {
      throw ServerError.UnauthorizedError()
    }
    const token = bearer.split(" ")[1]

    const userData = jwt.verify(token, JWT_SECRET_ACCESS)
    req.userId = (userData as jsonUserData).id
  } catch (err) {
    throw ServerError.UnauthorizedError()
  }
  
  next()
}

export default isAuth