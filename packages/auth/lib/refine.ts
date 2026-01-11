import { type AuthProvider, Refine } from "@refinedev/core";
import { authClient } from "./client";
import { AuthCallbackDefaults } from "./defaults";

export const authProvider: AuthProvider = {
  login: async (params) => {
    const { email, password, options, providerName } = params;
    console.log(
      "🚀 ~ LOGIN provider, email, password, options:",
      providerName,
      email,
      password,
      options,
      params
    );
    const { data, error } = providerName
      ? await authClient.signIn.social({
          provider: providerName,
          ...AuthCallbackDefaults("backoffice"),
        })
      : await authClient.signIn.email({
          email,
          password,
          ...AuthCallbackDefaults("backoffice"),
        });
    if (error)
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    console.log("🚀 ~ data:", data);
    if (!data.redirect) window.location.href = data.url;
    return { success: true, redirectTo: "/" };
  },
  check: async (params) => {
    const { data, error } = await authClient.getSession();
    console.log("🚀  check~ params:", params, data, error);
    if (error || !data)
      return {
        success: false,
        authenticated: false,
        logout: true,
        redirectTo: "/login",
        error: {
          name: "Login Error",
          message:
            data == null
              ? "User logged out"
              : error?.message || "Invalid credentials",
        },
      };
    console.log("🚀 ~ data:", data);
    return { authenticated: true, success: true };
  },
  logout: async (params) => {
    console.log("🚀  logout ~ params:", params);
    const { data, error } = await authClient.signOut();
    console.log("🚀 ~ error:", error);
    if (error)
      return {
        success: false,
        redirectTo: "/login",
        error: {
          name: "Login Error",
          message:
            data == null
              ? "User logged out"
              : error?.message || "Invalid credentials",
        },
      };
    return { success: true, redirectTo: "/login" };
  },
  onError: async (params) => ({}),
  register: async ({ provider, email, password, options }) => {
    console.log("🚀register ~ { provider, email, password, options }:", {
      provider,
      email,
      password,
      options,
    });
    const { data, error } = provider
      ? await authClient.signIn.social({ provider })
      : await authClient.signUp.email({ name: email, email, password });
    if (error)
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    console.log("🚀 ~ data:", data);
    return { success: true, redirectTo: "/" };
  },
  forgotPassword: async ({ email, options }) => {
    const { data, error } = await authClient.requestPasswordReset({
      email, // required
      redirectTo: options?.redirectTo || "/reset-password",
    });
    if (error)
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    console.log("🚀 ~ data:", data);
    return { success: true, redirectTo: "/dashboard" };
  },
  updatePassword: async ({ newPassword, currentPassword, options }) => {
    const { data, error } = await authClient.changePassword({
      newPassword, // required
      currentPassword, // required
      revokeOtherSessions: true,
    });
    if (error)
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    console.log("🚀 ~ data:", data);
    return { success: true, redirectTo: "/dashboard" };
  },
  getPermissions: async (params) => {
    const { data, error } = await authClient.getSession();
    if (error)
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    console.log("🚀 ~ data:", data);
    return { success: true, redirectTo: "/dashboard" };
  },
  getIdentity: async () => {
    const { data, error } = await authClient.getSession();
    if (error)
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    console.log("🚀 ~ data:", data);
    return data?.user;
  },
};
