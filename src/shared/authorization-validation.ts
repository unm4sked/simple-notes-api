import Joi from "joi";
import { UnauthorizedError } from "./errors/unauthorized.error";

export const validateAuthorizationHeader = async (authHeader?: string): Promise<string> => {
  const schema = Joi.string().min(3).required();

  const { value, error } = schema.validate(authHeader);

  if (error) {
    throw new UnauthorizedError("Provide valid authorization header with password");
  }

  return value;
};
