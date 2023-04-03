import { DateTime } from "luxon";

export const TestRoutes = {
  unknown: {
    request: {
      method: "GET",
      path: "/unknown-route",
    },
    response: {
      fakeKey: "fakeValue",
    },
    responseCode: 200,
  },
  auth: {
    request: {
      method: "POST",
      path: "/api/v1/authentication/login",
    },
    response: {
      exires_at: DateTime.now().plus({ days: 1 }).toISODate(),
      token: "fakeToken",
    },
    responseCode: 201,
  },
  allowed: {
    "200": {
      request: {
        method: "GET",
        path: "/api/v1/accounts",
      },
      response: {
        fakeKey: "fakeValue",
      },
      responseCode: 200,
    },
    "400": {
      request: {
        method: "GET",
        path: "/api/v1/accounts",
      },
      response: {
        fakeKey: "fakeValue",
      },
      responseCode: 400,
    },
    "500": {
      request: {
        method: "GET",
        path: "/api/v1/accounts",
      },
      response: {
        fakeKey: "fakeValue",
      },
      responseCode: 500,
    },
    fileUpload: {
      request: {
        method: "POST",
        path: "/api/v1/files/upload",
      },
      response: {
        fakeKey: "fakeValue",
      },
      responseCode: 200,
    },
  },
} as const;
