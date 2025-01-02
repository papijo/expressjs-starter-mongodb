import { ErrorNames } from "../../enums/error.enum";

export class SystemError extends Error {
  private _code?: number;
  private _errors?: Object;
  public name: string;

  get code(): number | undefined {
    return this._code;
  }

  get errors(): Object | undefined {
    return this._errors;
  }

  constructor(
    code: number,
    message: string = "Sorry, something went wrong!",
    name?: string,
    errors?: Object,
  ) {
    super(message); // 'Error' breaks prototype chain here
    this._code = code || 500;
    this.message = message;
    this._errors = errors;
    this.name = name;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export class ApplicationError extends SystemError {
  constructor(code: number, message: string, errors?: Object) {
    super(code, message, ErrorNames.APPLICATIONERROR, errors);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends SystemError {
  constructor(message?: string) {
    super(404, message || "Resource not found.", ErrorNames.NOTFOUNDERROR);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConflictError extends SystemError {
  constructor(message: string) {
    super(409, message, ErrorNames.CONFLICTERROR);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends SystemError {
  constructor(message?: string) {
    super(
      401,
      message || "You are not authorized to access this resource.",
      ErrorNames.UNAUTHORIZEDERROR,
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends SystemError {
  constructor(message?: string) {
    super(400, message || "Bad Request!", ErrorNames.BADREQUESTERROR);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbbidenError extends SystemError {
  constructor(message?: string) {
    super(403, message || "Access Denied!", ErrorNames.FORBIDDENERROR);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends SystemError {
  constructor(message?: string) {
    super(422, message || "Validation failed!", ErrorNames.VALIDATIONERROR);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
