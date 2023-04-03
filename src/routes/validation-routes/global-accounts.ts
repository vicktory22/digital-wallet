import { AllowedRoute } from "../routes";

export function getGlobalAccountRoutes(prefix?: string): AllowedRoute[] {
  return [
    {
      name: "Get a list of global account",
      method: "GET",
      url: `${prefix}/global_accounts`,
    },
    {
      name: "Get global account by ID",
      method: "GET",
      url: `${prefix}/global_accounts/:global_account_id`,
    },
    {
      name: "Update existing global account",
      method: "POST",
      url: `${prefix}/global_accounts/update/:global_account_id`,
    },
    {
      name: "Open a global account",
      method: "POST",
      url: `${prefix}/global_accounts/create`,
    },
    {
      name: "Generate a global account statement",
      method: "POST",
      url: `${prefix}/global_accounts/:global_account_id/generate_statement_letter`,
    },
    {
      name: "Get global account transactions",
      method: "GET",
      url: `${prefix}/global_accounts/:global_account_id/transactions`,
    },
  ];
}
