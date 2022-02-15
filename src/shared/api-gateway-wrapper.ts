import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import pino from "pino";
import { handleError } from "./error-handler";

const logger = pino();

export const wrapApiGatewayHandler = (handler: {
  (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>;
}) => {
  const gatewayHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
      return await handler(event, context);
    } catch (error: unknown) {
      logger.info(error);
      return handleError(error);
    }
  };

  return gatewayHandler;
};
