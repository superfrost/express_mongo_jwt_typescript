import { User } from '../models/user.model';

export class UserDto {
  login: string;
  email: string;
  id: string;

  constructor(userModel: User) {
    this.login = userModel.login;
    this.email = userModel.email;
    this.id = userModel._id;
  }
}