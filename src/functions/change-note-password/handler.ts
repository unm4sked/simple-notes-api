import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import { NotesRepository } from "../../domain/repositories/notes.repository";
import { NotesService } from "../../domain/services/notes.service";

import { wrapApiGatewayHandler } from "../../shared/api-gateway-wrapper";
import { validateAuthorizationHeader } from "../../shared/authorization-validation";
import { initDefaultConfig } from "../../shared/config";
import { apiSuccess } from "../../shared/responses";
import { validateChangePasswordBody } from "./event-validation";

const logger = pino();

export const handler = wrapApiGatewayHandler(async (event: APIGatewayProxyEvent, _context: Context) => {
  const payload = await validateChangePasswordBody(event.body);
  const password = await validateAuthorizationHeader(event.headers.Authorization);
  const config = await initDefaultConfig();

  const service = new NotesService(
    new NotesRepository(new DynamoDBClient({ region: config.region }), config.ddbTableName),
    config,
    logger,
  );

  await service.changePassword(event.pathParameters!.id!, password, payload.newPassword);

  return apiSuccess(StatusCodes.OK);
});
