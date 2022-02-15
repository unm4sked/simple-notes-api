import Joi from "joi";

export interface Config {
  ddbTableName: string;
  s3BucketName: string;
  region: string;
}

const loadEnv = (env: NodeJS.ProcessEnv): Config => ({
  ddbTableName: process.env.NOTES_TABLE!,
  s3BucketName: process.env.EXPORTS_S3_BUCKET!,
  region: process.env.REGION!,
});

const validateConfig = async (config: Config) => {
  const schema = Joi.object<Config>().keys({
    ddbTableName: Joi.string().required(),
    s3BucketName: Joi.string().required(),
    region: Joi.string().required(),
  });

  return schema.validateAsync(config);
};
export const initDefaultConfig = async (): Promise<Config> => {
  const config = loadEnv(process.env);
  return validateConfig(config);
};
