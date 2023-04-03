import Fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import { EnvOptions, envOptions } from "./plugins/env";
import auth, { fetchToken, isTokenExpired } from "./plugins/authentication";
import errors, {
  FetchTokenError,
  InvalidRouteError,
} from "./plugins/error-handler";
import env from "@fastify/env";
import sensible from "@fastify/sensible";
import proxy, { FastifyHttpProxyOptions } from "@fastify/http-proxy";
import { isAllowedRoute, isFileUploadRoute } from "./routes/routes";
import { MockPool } from "undici";

type CreateServerInput = {
  opts?: FastifyServerOptions;
  testingOpts?: {
    mockHTTPClient?: MockPool.Options;
    upstreamURL?: string;
    envOptions: EnvOptions;
  };
};

export async function createServer({
  opts,
  testingOpts,
}: CreateServerInput = {}): Promise<FastifyInstance> {
  const server = Fastify(opts);

  server.register(auth);
  server.register(errors);
  server.register(env, getEnvOptions(envOptions, testingOpts?.envOptions));
  server.register(sensible);
  await server.after(); // waits for env to be loaded

  server.register(proxy, {
    upstream: testingOpts?.upstreamURL || server.config.UPSTREAM_URL,
    preHandler: preHandleProxyRequest,
    undici: testingOpts?.mockHTTPClient || {}, // mockClient is used for testing
    replyOptions: {
      getUpstream: function (request, base) {
        if (isFileUploadRoute(request.url)) {
          return server.config.UPSTREAM_FILE_URL;
        }

        return base;
      },
      rewriteRequestHeaders: function (_, headers) {
        return {
          ...headers,
          Authorization: `Bearer ${server.auth.token}`,
        };
      },
    },
  });

  return server;
}

const preHandleProxyRequest: FastifyHttpProxyOptions["preHandler"] =
  async function (request) {
    if (!isAllowedRoute(request.method, request.url)) {
      throw InvalidRouteError.create();
    }

    if (!isTokenExpired(this.auth.expires_at)) {
      return;
    }

    const [err, fetchTokeResponse] = await this.to(
      fetchToken({
        baseUrl: this.config.UPSTREAM_URL,
        clientId: this.config.CLIENT_ID,
        apiKey: this.config.API_KEY,
      }),
    );

    if (err) {
      throw FetchTokenError.create();
    }

    this.auth.token = fetchTokeResponse.token;
    this.auth.expires_at = fetchTokeResponse.expires_at;
  };

export function getEnvOptions(
  envOpts: EnvOptions,
  testingEnvOpts: EnvOptions | undefined,
) {
  return testingEnvOpts ? testingEnvOpts : envOpts;
}
