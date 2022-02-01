import userModel from '../models/user.model';
import bcrypt from 'bcrypt';
import tokenService from './token.service';
import { UserDto } from '../dto/user.dto';
import ServerError from '../exceptions/serverError';
import axios from 'axios';
import photoModel, { Photo } from '../models/photo.model';
import albumModel, { Album } from '../models/album.model';
import { Types } from 'mongoose';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string)
const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS as string;

export type AccessToken = string

class UserService {
  async registration(login: string, email: string, password: string) {
    const candidate = await userModel.findOne({ email: email })
    if (candidate) {
      throw ServerError.BadRequest(`User with this email or login already exist`)
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await userModel.create({ email: email, login: login, password: hashPassword})

    const userDto = new UserDto(user)
    const tokens = await tokenService.generateToken(JSON.stringify(userDto))

    await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken)

    return { ...tokens, userDto}
  }

  async login(email: string = "", login: string = "", password: string): Promise<AccessToken> {
    let isUserInDb
    if ( email ) {
      isUserInDb = await userModel.findOne({ email })
    } else {
      isUserInDb = await userModel.findOne({ login })
    }
    if(!isUserInDb) {
      logger.info("Wrong or No username");
      throw ServerError.BadRequest("Wrong username or password!")
    }
    
    const hashFromDB = isUserInDb.password
    const result = await bcrypt.compare(password, hashFromDB)
    if(!result) {
      logger.info("Wrong password");
      throw ServerError.BadRequest("Wrong username or password!")
    }
    const token = await jwt.sign(`{ "id": "${isUserInDb._id}"}`, JWT_SECRET_ACCESS) 
    return token
  }

  async changeAlbumTitle(albumid: string, new_album_name: string, userId: string) {
    const result = await albumModel.updateOne({ _id: albumid}, { title: new_album_name }, {owner: userId})
    return result
  }
  
  async deleteAlbum(manyId: Array<string>, userId: string) {
    const result = await albumModel.deleteMany({_id: { $in: manyId}}, { owner: userId})
    return result
  }
  
  async deletePhoto(manyId: Array<string>, userId: string) {
    const result = await photoModel.deleteMany({_id: { $in: manyId}}, { owner: userId})
    return result
  }
  
  async getPhotos(ownerid: string = '', page: number = 0, maxcount: number = 0) {
    let params = {}
    if (ownerid) { params = {owner: { $in: ownerid}}}
    // @ts-ignore
    const result = await photoModel.paginate(params, { page: page, limit: maxcount })
    return result
  }

  async loadPhotos(userId: string) {
    const res = await axios.get("http://jsonplaceholder.typicode.com/photos?_start=0&_limit=200")
    const json = res.data

    const albumArr = createAlbumsArr(json, userId)
    const resAlbums: Array<Album> = await albumModel.insertMany(albumArr)
    const photos  = createPhotosArr(resAlbums, json, userId)
    const resultPhoto = await photoModel.insertMany(photos)
    return resultPhoto
  }
}

export default new UserService()

function createAlbumsArr(photos: Array<Photo>, userId: string) {
  const set = new Set()
  photos.forEach((photo) => {
    set.add(photo.albumId)
  })

  const albumsArr = [...set].map(el => {
    return { 
      title: el,
      owner: userId,
    }
  })

  return albumsArr
}

interface jsonPlaceholderPhoto {
  albumId: number,
  id: number,
  title: string,
  url: string,
  thumbnailUrl: string
}

function createPhotosArr(albums: Array<Album>, json: Array<jsonPlaceholderPhoto>, userId: unknown) {
  const albumsId = new Map;
  albums.forEach((album) => {albumsId.set(album.title, album._id)})
  
  const photos = json.map(el => {
    return { 
      albumId: albumsId.get(el.albumId) as Types.ObjectId,
      title: el.title,
      url: el.url,
      thumbnailUrl: el.thumbnailUrl,
      owner: userId as Types.ObjectId,
    }
  })

  return photos
}