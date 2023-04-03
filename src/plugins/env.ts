export type ConfigPlugin = {
  CLIENT_ID: string;
  API_KEY: string;
  UPSTREAM_URL: string;
  UPSTREAM_FILE_URL: string;
};

export const envSchema = {
  type: "object",
  required: ["CLIENT_ID", "API_KEY", "UPSTREAM_URL", "UPSTREAM_FILE_URL"],
  properties: {
    CLIENT_ID: {
      type: "string",
    },
    API_KEY: {
      type: "string",
    },
    UPSTREAM_URL: {
      type: "string",
    },
    UPSTREAM_FILE_URL: {
      type: "string",
    },
  },
};

export type EnvOptions = {
  dotenv: boolean;
  schema: typeof envSchema;
  data?: ConfigPlugin;
};

export const envOptions = {
  dotenv: true,
  schema: envSchema,
};

export const testEnvOptions = {
  dotenv: false,
  schema: envSchema,
  data: {
    UPSTREAM_URL: "http://localhost",
    CLIENT_ID: "test",
    API_KEY: "test",
    UPSTREAM_FILE_URL: "http://localhsot",
  },
};
