import Joi from "joi";

export const validateChangePasswordBody = async (eventBody: string | null): Promise<{ newPassword: string }> => {
  const schema = Joi.object<{ newPassword: string }>({
    newPassword: Joi.string().required(),
  }).options({
    abortEarly: false,
  });

  const body = JSON.parse(eventBody || "{}");

  return schema.validateAsync(body);
};
