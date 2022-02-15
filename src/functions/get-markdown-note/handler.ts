import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

import { NotesRepository } from "../../domain/repositories/notes.repository";
import { NotesService } from "../../domain/services/notes.service";
import { S3Service } from "../../domain/services/s3.service";
import { wrapApiGatewayHandler } from "../../shared/api-gateway-wrapper";
import { validateAuthorizationHeader } from "../../shared/authorization-validation";
import { initDefaultConfig } from "../../shared/config";
import { apiSuccess } from "../../shared/responses";

const logger = pino();

export const handler = wrapApiGatewayHandler(async (event: APIGatewayProxyEvent, _context: Context) => {
  const config = await initDefaultConfig();
  const password = await validateAuthorizationHeader(event.headers.authorization);

  const noteService = new NotesService(
    new NotesRepository(new DynamoDBClient({ region: config.region }), config.ddbTableName),
    config,
    logger,
  );
  const s3Service = new S3Service(new S3Client({ region: config.region }), config, logger);

  const note = await noteService.getNote(event.pathParameters!.id!, password);
  const key = await s3Service.uploadAsMarkdownFile(note);
  const url = await s3Service.generateGetObjectPresignUrl(key);

  return apiSuccess(StatusCodes.OK, { url });
});
