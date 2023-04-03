import { describe, it, expect } from "vitest";
import { isAllowedRoute, allowedRoutes } from "../routes";
import { getFileRoutes } from "../validation-routes/file-upload";
import { getAccountRoutes } from "../validation-routes/accounts";
import { getGlobalAccountRoutes } from "../validation-routes/global-accounts";
import { getSimulationRoutes } from "../validation-routes/simulation";

describe("routes", () => {
  describe("isAllowedRoute", () => {
    it("should return true for a valid route and method", () => {
      expect(isAllowedRoute("GET", "/api/v1/accounts")).toBe(true);
    });

    it("should return true for a valid route and method when using wildcard", () => {
      expect(
        isAllowedRoute("GET", "/api/v1/accounts/:connected_account_id"),
      ).toBe(true);
    });

    it("should return false for a valid route and invalid method", () => {
      expect(isAllowedRoute("PUT", "/api/v1/accounts")).toBe(false);
    });

    it("should return false for a invalid path and valid method", () => {
      expect(isAllowedRoute("GET", "/invalid-path")).toBe(false);
    });
  });

  describe("allowedRoutes", () => {
    it("should have all routes present", () => {
      const prefix = "/api/v1";

      const expectedRoutes = [
        ...getFileRoutes(prefix),
        ...getAccountRoutes(prefix),
        ...getGlobalAccountRoutes(prefix),
        ...getSimulationRoutes(prefix),
      ];

      expect(allowedRoutes).toEqual(expectedRoutes);
    });
  });
});
