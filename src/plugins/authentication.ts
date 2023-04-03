import { FastifyInstance } from "fastify";
import { FetchTokenError } from "./error-handler";
import fp from "fastify-plugin";
import { DateTime } from "luxon";
import { request } from "undici";

export type AuthDetails = {
  token: string;
  expires_at: DateTime;
};

export default fp(async function (server: FastifyInstance) {
  server.decorate("auth", {
    token: "",
    expires_at: DateTime.now(),
  });
});

export function isTokenExpired(tokenExpiration: DateTime): boolean {
  return tokenExpiration <= DateTime.now();
}

export type FetchTokenInput = {
  baseUrl: string;
  clientId: string;
  apiKey: string;
};

export async function fetchToken({
  baseUrl,
  clientId,
  apiKey,
}: FetchTokenInput): Promise<AuthDetails> {
  const { statusCode, body } = await request(
    `${baseUrl}/api/v1/authentication/login`,
    {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-api-key": apiKey,
      },
    },
  );

  if (statusCode !== 201) {
    throw FetchTokenError.create();
  }

  const { token, expires_at } = await body.json();

  return { token, expires_at: DateTime.fromISO(expires_at) };
}
