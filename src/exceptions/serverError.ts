
export = class ServerError extends Error {
  status: number;
  errors?: any[]

  constructor(status: number, message: string, errors: [] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ServerError(401, 'User not authorized')
  }

  static BadRequest(message: string, errors: [] = []) {
    return new ServerError(400, message, errors)
  }

  static InternalError() {
    return new ServerError(500, 'Server side error')
  }

  static UserNotExistsError(message: string) {
    return new ServerError(406, message)
  }
}