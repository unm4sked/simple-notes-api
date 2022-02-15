import type { APIGatewayProxyEvent } from "aws-lambda";
import Joi from "joi";
import { NoteDto } from "../../domain/interfaces/note";

export const validateCreateNoteBody = async (eventBody: string | null): Promise<NoteDto> => {
  const schema = Joi.object<NoteDto>({
    title: Joi.string().required(),
    text: Joi.string().required(),
    password: Joi.string().required(),
    expirationDate: Joi.date().optional(),
  }).options({
    abortEarly: false,
  });

  const body = JSON.parse(eventBody || "{}");

  return schema.validateAsync(body);
};
