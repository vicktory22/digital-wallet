import { AllowedRoute } from "../routes";

export function getAccountRoutes(prefix?: string): AllowedRoute[] {
  return [
    {
      name: "Get list of connected accounts",
      method: "GET",
      url: `${prefix}/accounts`,
    },
    {
      name: "Get account by ID",
      method: "GET",
      url: `${prefix}/accounts/:connected_account_id`,
    },
    {
      name: "Create an account",
      method: "POST",
      url: `${prefix}/accounts/create`,
    },
    {
      name: "Update a connected account",
      method: "POST",
      url: `${prefix}/accounts/:connected_account_id/update`,
    },
    {
      name: "Submit account for activation",
      method: "POST",
      url: `${prefix}/accounts/:connected_account_id/submit`,
    },
  ];
}
