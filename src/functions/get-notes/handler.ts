import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

import { NotesRepository } from "../../domain/repositories/notes.repository";
import { NotesService } from "../../domain/services/notes.service";
import { wrapApiGatewayHandler } from "../../shared/api-gateway-wrapper";
import { initDefaultConfig } from "../../shared/config";
import { apiSuccess } from "../../shared/responses";

const logger = pino();

export const handler = wrapApiGatewayHandler(async (_event: APIGatewayProxyEvent, _context: Context) => {
  const config = await initDefaultConfig();

  const service = new NotesService(
    new NotesRepository(new DynamoDBClient({ region: config.region }), config.ddbTableName),
    config,
    logger,
  );
  const notes = await service.getNotes();

  return apiSuccess(StatusCodes.OK, notes);
});
