import { HttpError } from "./http.error";

export class UnauthorizedError extends HttpError {
  public constructor(message = "Unauthorized") {
    super(message, 401);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

