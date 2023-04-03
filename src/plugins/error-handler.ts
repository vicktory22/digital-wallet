import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(async function (server: FastifyInstance) {
  server.setErrorHandler((error, _request, reply) => {
    switch (true) {
      case error instanceof InvalidRouteError:
        reply.status(404).send({ message: "Invalid Route." });
        break;
      default:
        reply.internalServerError();
    }
  });
});

export class InvalidRouteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRouteError";
  }

  static create() {
    return new InvalidRouteError("Invalid Route");
  }
}

export class FetchTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchTokenError";
  }

  static create(): FetchTokenError {
    return new FetchTokenError("Error fetching token");
  }
}
