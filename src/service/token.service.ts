import dotenv from 'dotenv';
dotenv.config()
import jwt from 'jsonwebtoken';
import tokenModel from '../models/token.model';

const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS as string;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH as string;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

class TokenService {
  generateToken(payload: string): Tokens {
    const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, );
    const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH,);
    console.log("ACCESS: ", accessToken);
    
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const tokenData = await tokenModel.findOne({userId})
    if (tokenData) {
      tokenData.token = refreshToken
      const result = await tokenData.save()
      return result
    }
    const token = await tokenModel.create({userId: userId, token: refreshToken})
    return token
  }
}

export default new TokenService()