import { createMiddleware } from "hono/factory";
import { Polar } from "@polar-sh/sdk";
import { HTTPException } from "hono/http-exception";
import type { APIBindings } from "./type";

const HTTP_UNAUTHORIZED = 401;

export const initPaymentSdk = createMiddleware<APIBindings>(async (c, next) => {
  const polarConfig: {
    accessToken: string;
    server?: "sandbox" | "production";
  } = {
    accessToken: c.env.POLAR_ACCESS_TOKEN ?? "",
  };

  if (c.env.ENVIRONMENT !== "production") {
    polarConfig.server = "sandbox";
  }

  const polar = new Polar(polarConfig);
  c.set("polar", polar);
  return next();
});

export const paymentsMiddleware = createMiddleware<APIBindings>(
  async (c, next) => {
    const polar = c.get("polar");
    const user = c.var.user;

    const addCredits = async (amount: number, reason = "credits_added") => {
      if (!user) {
        throw new HTTPException(HTTP_UNAUTHORIZED, {
          message: "Authentication required",
        });
      }

      const normalizedAmount = Math.abs(amount);
      await polar.events.ingest({
        events: [
          {
            name: "credits_added",
            externalCustomerId: user.id,
            metadata: { units: normalizedAmount, reason },
          },
        ],
      });
    };

    const spendCredits = async (amount: number, eventName: string) => {
      if (!user) {
        throw new HTTPException(HTTP_UNAUTHORIZED, {
          message: "Authentication required",
        });
      }

      const normalizedAmount = Math.abs(amount);
      await polar.events.ingest({
        events: [
          {
            name: eventName,
            externalCustomerId: user.id,
            metadata: { units: normalizedAmount },
          },
        ],
      });
    };

    const getBalance = async () => {
      if (!user) {
        throw new HTTPException(HTTP_UNAUTHORIZED, {
          message: "Authentication required",
        });
      }

      try {
        const usage = await polar.customerMeters.list({
          externalCustomerId: user.id,
        });
        return usage.result.items?.[0]?.balance ?? 0;
      } catch (e) {
        console.error("Failed to fetch balance from Polar", e);
        return 0;
      }
    };

    const hasSufficientBalance = async (amount: number) => {
      if (!user) {
        throw new HTTPException(HTTP_UNAUTHORIZED, {
          message: "Authentication required",
        });
      }
      const balance = await getBalance();
      return balance >= amount;
    };

    c.set("addCredits", addCredits);
    c.set("spendCredits", spendCredits);
    c.set("getBalance", getBalance);
    c.set("hasSufficientBalance", hasSufficientBalance);

    return next();
  },
);
