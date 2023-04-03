import { AllowedRoute } from "../routes";

export function getSimulationRoutes(prefix?: string): AllowedRoute[] {
  return [
    {
      name: "Update status of connected account",
      method: "POST",
      url: `${prefix}/simulation/accounts/:connected_account_id/update_status`,
    },
    {
      name: "Create a global account deposit",
      method: "POST",
      url: `${prefix}/simulation/deposit/create`,
    },
  ];
}
