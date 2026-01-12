import type { AppType } from "@printy-mobile/api/client";
import { hc } from "hono/client";
import { authClient } from "@/lib/auth-client";
import { hcQuery } from "hono-rpc-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.log(error);
    },
  }),
});

// Environment-specific API endpoint detection
export const getApiHost = () => process.env.EXPO_PUBLIC_SERVER_URL;

export const api = hcQuery(
  hc<AppType>(getApiHost() as string, {
    init: {
      credentials: "include", // Required for sending cookies cross-origin
    },
  }),
);
