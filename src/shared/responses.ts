import { StatusCodes } from "http-status-codes";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Methods": "POST,GET,OPTIONS,PATCH,DELETE",
};

interface APIError {
  code?: string;
  message: string;
}

export const apiError = (statusCode: StatusCodes, e: APIError | APIError[]) => {
  const errors = Array.isArray(e) ? e : [e];
  return {
    statusCode,
    body: JSON.stringify({
      success: false,
      errors,
    }),
    headers,
  };
};

export const apiSuccess = (statusCode: StatusCodes, attributes?: any | any[], totalCount?: number) => {
  const data = Array.isArray(attributes) ? attributes.map((a) => ({ attributes: a })) : { attributes };

  return {
    statusCode,
    body: JSON.stringify({
      success: true,
      data,
      totalCount,
    }),
    headers,
  };
};
