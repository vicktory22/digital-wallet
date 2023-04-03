import { FastifyInstance } from "fastify";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { getMockClient } from "../test-setup/clients/mock-client";
import { isAllowedRoute } from "..//routes/routes";
import { createServer, getEnvOptions } from "../server";
import { TestRoutes } from "./fixtures/test-routes";
import * as authPlugin from "../plugins/authentication";
import { EnvOptions, testEnvOptions } from "../plugins/env";

describe("Http Proxy", () => {
  let server: FastifyInstance;
  const mockHTTPClient = getMockClient("http://localhost");
  const {
    request: authRequest,
    response: authResponse,
    responseCode: authResponseCode,
  } = TestRoutes.auth;
  mockHTTPClient.intercept(authRequest).reply(authResponseCode, authResponse);

  beforeAll(async () => {
    server = await createServer({
      testingOpts: {
        // @ts-ignore
        mockHTTPClient,
        upstreamURL: "http://localhost",
        envOptions: testEnvOptions,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return 404 for route not in the allowedRoutes list", async () => {
    const { request } = TestRoutes.unknown;

    // verify this is not on the allowed routes list
    expect(isAllowedRoute(request.method, request.path)).toBe(false);

    const mockedResponse = await server.inject({
      method: request.method,
      url: request.path,
    });

    expect(mockedResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 404,
        body: expect.stringContaining("Invalid Route."),
      }),
    );
  });

  it("should proxy an allowed route with a 200 response", async () => {
    const { request, response, responseCode } = TestRoutes.allowed[200];

    mockHTTPClient.intercept(request).reply(responseCode, response);

    const mockResponse = await server.inject({
      method: request.method,
      url: request.path,
    });

    expect(mockResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 200,
        body: expect.stringContaining(""),
      }),
    );
  });

  it("should proxy an allowed route with a 500 response", async () => {
    const { request, response, responseCode } = TestRoutes.allowed[500];

    mockHTTPClient.intercept(request).reply(responseCode, response);

    const mockResponse = await server.inject({
      method: request.method,
      url: request.path,
    });

    expect(mockResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      }),
    );
  });

  it("should proxy an allowed route with a 400 response", async () => {
    const { request, response, responseCode } = TestRoutes.allowed[400];

    mockHTTPClient.intercept(request).reply(responseCode, response);

    const mockResponse = await server.inject({
      method: request.method,
      url: request.path,
    });

    expect(mockResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 400,
        statusMessage: "Bad Request",
      }),
    );
  });

  it("should handle the file upload route", async () => {
    const { request, response, responseCode } = TestRoutes.allowed.fileUpload;

    mockHTTPClient.intercept(request).reply(responseCode, response);

    const mockResponse = await server.inject({
      method: request.method,
      url: request.path,
    });

    expect(mockResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 200,
      }),
    );
  });

  it("should handle when we receive an error fetching the token", async () => {
    const { request, response, responseCode } = TestRoutes.allowed.fileUpload;

    mockHTTPClient.intercept(request).reply(responseCode, response);

    // mock fetchToken method to throw an error
    vi.spyOn(authPlugin, "isTokenExpired").mockReturnValue(true);
    vi.spyOn(authPlugin, "fetchToken").mockRejectedValue({
      error: "fake error",
    });

    const mockResponse = await server.inject({
      method: request.method,
      url: request.path,
    });

    expect(mockResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 500,
      }),
    );
  });
});

describe("Env Options", () => {
  it("should return default env options if test env options are not provided", () => {
    const testEnvOptions = undefined;
    const envOptions = { realKey: "realValue" } as unknown as EnvOptions;

    expect(getEnvOptions(envOptions, testEnvOptions)).toEqual(envOptions);
  });

  it("should return test env options if test env options are provided", () => {
    const testEnvOptions = { testKey: "testValue" } as unknown as EnvOptions;
    const envOptions = { realKey: "realValue" } as unknown as EnvOptions;

    expect(getEnvOptions(envOptions, testEnvOptions)).toEqual(testEnvOptions);
  });
});
