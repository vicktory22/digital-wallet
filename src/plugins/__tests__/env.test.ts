import { describe, it, expect } from "vitest";
import { envSchema, envOptions } from "../env";

describe("env", () => {
  it("should have correct schema", () => {
    const expectedSchema = {
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

    expect(expectedSchema).toEqual(envSchema);
  });

  it("should have the correrct envOptions", () => {
    const expectedEnvOptions = {
      dotenv: true,
      schema: envSchema,
    };

    expect(expectedEnvOptions).toEqual(envOptions);
  });
});
