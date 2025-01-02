import { config } from "dotenv";
import Joi from "joi";
import { DebugOptions, ServerEnvOptions } from "../enums/config.enum";
import debug from "debug";

config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .default(ServerEnvOptions.DEVELOPMENT)
      .valid(...Object.values(ServerEnvOptions)),
    PORT: Joi.number().default(4975),
    DEBUG_MODE: Joi.string()
      .default(DebugOptions.DEVELOPMENT)
      .valid(...Object.values(DebugOptions)),
    ALLOWED_ORIGINS: Joi.string().default("*"),
    MONGODB_URI: Joi.string().required(),
    DECRYPT_KEY: Joi.string().required(),
    ENCRYPT_KEY: Joi.string().required(),
    SESSION_SECRET: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

class ServerConfig {
  public NODE = {
    ENV: envVars.NODE_ENV,
    SERVICE: envVars.npm_package_name,
    VERSION: envVars.npm_package_version,
    DEVELOPER: envVars.npm_package_author,
    LICENSE: envVars.npm_package_license,
  };

  public DEBUG = debug(envVars.DEBUG_MODE);

  public PORT = envVars.PORT;

  public ALLOWED_ORIGINS = envVars.ALLOWED_ORIGINS;

  public MONGODB_URI = envVars.MONGODB_URI;

  public SESSION_SECRET = envVars.SESSION_SECRET;

  // JWT Object
  public JWTKeys = {
    encryptKey: envVars.ENCRYPT_KEY,
    decryptKey: envVars.DECRYPT_KEY,
  };
}

export default new ServerConfig();
