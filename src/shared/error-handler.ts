import { StatusCodes } from "http-status-codes";
import { ValidationError } from "joi";

import { AppError } from "./errors/app.error";
import { HttpError } from "./errors/http.error";
import { apiError } from "./responses";

export const handleError = (error: unknown) => {
  if (error instanceof ValidationError) {
    return apiError(StatusCodes.BAD_REQUEST, error.details);
  }

  if (error instanceof HttpError) {
    return apiError(error.status, { message: error.message });
  }

  if (error instanceof AppError) {
    return apiError(StatusCodes.INTERNAL_SERVER_ERROR, { message: error.message });
  }

  return apiError(StatusCodes.INTERNAL_SERVER_ERROR, { message: "Unknown internal server error" });
};
