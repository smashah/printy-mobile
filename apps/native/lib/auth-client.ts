import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export const authClient = createAuthClient({
  // biome-ignore lint/style/useNamingConvention: Library expects baseURL
  baseURL: process.env["EXPO_PUBLIC_SERVER_URL"],
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
  ],
});

export const { useSession, signIn, signOut } = authClient;
