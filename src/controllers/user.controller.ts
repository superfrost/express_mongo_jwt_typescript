import { Request, Response, NextFunction } from "express";
import userService from '../service/user.service';
import { validationResult } from 'express-validator';
import { UserRequest } from "../middlewares/isAuth";
import ServerError from "../exceptions/serverError";
import logger from '../utils/logger'

class UserController {

  healthcheck(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(200)
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        throw ServerError.BadRequest("Validation error", validationErrors.array() as [])
      }
      const { email, login, password } = req.body
      const userData = await userService.registration(login, email, password)
      
      res.status(200).json({ message: "Success. New user added.", data: userData})
    } catch (err) {
      next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const login = req.body?.login
      const email = req.body?.email
      const password = req.body?.password
      if((!login && !email) || !password) {
        logger.info("No login or password");
        throw ServerError.BadRequest("No login or password")
      }
      const token = await userService.login(email, login, password)
      res.status(200).json({ message: "OK. Here is your token.", token: token })
    } catch (err) {
      next(err)
    }
  }

  async loadPhotos(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await userService.loadPhotos(req.userId)
      
      res.status(200).json({ message: "OK. Data was loaded."})
    } catch (err) {
      next()
    }
  } 

  async changeAlbumTitle(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { albumid, new_album_name } = req.body
      const userId = req.userId
      await userService.changeAlbumTitle(albumid, new_album_name, userId)
      res.status(200).json({ message: "OK. Album was renamed."})
    } catch (err) {
      next(err);
    }
  }

  async deleteAlbum(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId
      const albumid: string = req.body.albumid
      if (!albumid) {
        throw ServerError.BadRequest(" Check params of request")
      }
      const manyId = albumid.split(',')
      const result = await userService.deleteAlbum(manyId, userId)
      if (result.deletedCount === 0) {
        throw ServerError.BadRequest(" Check params of request")
      }
      res.status(200).json({message: "OK. Album was deleted"})
    } catch (err) {
      next(err);
    }
  }
  
  async deletePhoto(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId
      const photoid: string = req.body.photoid
      if (!photoid) {
        throw ServerError.BadRequest(" Check params of request")
      }
      const manyId = photoid.split(',')
      const result = await userService.deletePhoto(manyId, userId)
      if (result.deletedCount === 0) {
        throw ServerError.BadRequest(" Check params of request")
      }
      res.status(200).json({message: "OK. Photo was deleted"})
    } catch (err) {
      next(err);
    }
  }

  async getPhotos(req: UserRequest, res: Response, next: NextFunction) {
    try {
      let { ownerid, page, maxcount } = req.body
      console.log(ownerid, page, maxcount);
      
      page = parseInt(page)
      maxcount = parseInt(maxcount)
      if ( Number.isNaN(page) || Number.isNaN(maxcount) ) {
        throw ServerError.BadRequest(" Check params of request")
      }
      const result = await userService.getPhotos(ownerid, page, maxcount)
      res.status(200).json({ photos: result })
    } catch (err) {
      next(err);
    }
  }

}

export default new UserController()
