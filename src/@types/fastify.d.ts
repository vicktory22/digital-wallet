import { AuthDetails } from "../plugins/authentication";
import { ConfigPlugin } from "../plugins/env";

declare module "fastify" {
  export interface FastifyInstance {
    auth: AuthDetails;
    config: ConfigPlugin;
  }
}
