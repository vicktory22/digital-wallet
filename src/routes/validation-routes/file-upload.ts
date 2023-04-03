import { AllowedRoute } from "../routes";

export function getFileRoutes(prefix?: string): AllowedRoute[] {
  return [
    {
      name: "Upload a file",
      method: "POST",
      url: `${prefix}/files/upload`,
    },
  ];
}
