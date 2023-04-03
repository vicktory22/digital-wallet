import { describe, it, expect } from "vitest";
import { fetchToken } from "../authentication";
import { getMockClient } from "../../test-setup/clients/mock-client";
import { FetchTokenError } from "../error-handler";
import { TestRoutes } from "../../__tests__/fixtures/test-routes";

describe.only("Authentication Plugin", () => {
  const mockHTTPClient = getMockClient("http://localhost");

  describe("FetchToken", () => {
    it("throws an error when the response is not 201", async () => {
      const { request } = TestRoutes.auth;

      mockHTTPClient.intercept(request).reply(400, {});

      const fetchTokenPromise = fetchToken({
        baseUrl: "http://localhost",
        clientId: "fakeClientId",
        apiKey: "fakeApiKey",
      });

      await expect(fetchTokenPromise).rejects.toThrow(FetchTokenError);
    });
  });
});
