import { expect } from "vitest";

expect.extend({
  toBeInvalidRouteResponse(received) {
    return {
      pass:
        received.statusCode === 404 &&
        received.statusMessage === "Not Found" &&
        received.payload.includes("Invalid Route."),
      message: () =>
        `Response is${this.isNot ? " " : " not"} an Invalid Route response.`,
    };
  },
});
