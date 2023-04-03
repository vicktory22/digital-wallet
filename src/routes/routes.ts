import { getFileRoutes } from "./validation-routes/file-upload";
import { getAccountRoutes } from "./validation-routes/accounts";
import { getGlobalAccountRoutes } from "./validation-routes/global-accounts";
import { getSimulationRoutes } from "./validation-routes/simulation";

export type AllowedRoute = {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
};

const prefix = "/api/v1";

export const allowedRoutes: AllowedRoute[] = [
  ...getFileRoutes(prefix),
  ...getAccountRoutes(prefix),
  ...getGlobalAccountRoutes(prefix),
  ...getSimulationRoutes(prefix),
];

export function isAllowedRoute(method: string, url: string): boolean {
  const requestUrlParts = url.split("/");

  return allowedRoutes.some((route) => {
    if (route.method !== method) {
      return false;
    }

    const routeUrlParts = route.url.split("/");

    if (routeUrlParts.length !== requestUrlParts.length) {
      return false;
    }

    return routeUrlParts.every((part, partIdx) => {
      if (part.startsWith(":")) {
        return true;
      }

      return part === requestUrlParts[partIdx];
    });
  });
}

export function isFileUploadRoute(url: string): boolean {
  return url.startsWith(`${prefix}/files`);
}
