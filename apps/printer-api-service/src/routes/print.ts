import { Hono } from "hono";
import React from "react";
import ReactPDF, { type DocumentProps } from "@react-pdf/renderer";
import QRCode from "qrcode";
import {
  fetchGithubIssue,
  fetchLinearIssue,
  parseRecipeJson,
  generateColoringPage,
  GithubIssueLabel,
  LinearIssueLabel,
  Recipe,
  ColoringPage,
  WifiAccessCard,
  AssetDeviceTag,
  PullRequestBoardingPass,
  ReleaseDeploymentTag,
  BuildReceipt,
  DailyTodoList,
} from "@printy-mobile/capabilities";
import type {
  IssueData,
  RecipeData,
  WifiData,
  AssetData,
  PullRequestData,
  ReleaseData,
  BuildData,
  TodoData,
} from "@printy-mobile/capabilities";

const printRoutes = new Hono();

async function renderPdfResponse(
  element: React.ReactElement,
): Promise<Response> {
  const stream = await (ReactPDF.renderToStream as any)(element);
  return new Response(stream as unknown as ReadableStream, {
    headers: { "Content-Type": "application/pdf" },
  });
}

printRoutes.post("/github", async (c) => {
  try {
    const body = await c.req.json<{ url: string }>();
    const data = await fetchGithubIssue(body.url);
    data.qrCodeDataUrl = await QRCode.toDataURL(data.url);
    const element = React.createElement(GithubIssueLabel, { issue: data });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/linear", async (c) => {
  try {
    const body = await c.req.json<{ url: string }>();
    const data = await fetchLinearIssue(body.url);
    data.qrCodeDataUrl = await QRCode.toDataURL(data.url);
    const element = React.createElement(LinearIssueLabel, { issue: data });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/recipe", async (c) => {
  try {
    const body = await c.req.json<{ name: string; data?: RecipeData }>();
    let recipeData: RecipeData;

    if (body.data) {
      recipeData = body.data;
    } else {
      recipeData = {
        title: body.name,
        ingredients: [{ name: "Mock Ingredient", quantity: "1", unit: "unit" }],
        cookware: [],
        steps: ["Mock Step 1", "Mock Step 2"],
      };
    }

    const element = React.createElement(Recipe, { recipe: recipeData });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/coloring", async (c) => {
  try {
    const body = await c.req.json<{ prompt?: string }>();
    const data = await generateColoringPage(body.prompt);
    const element = React.createElement(ColoringPage, { data });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/wifi", async (c) => {
  try {
    const body = await c.req.json<WifiData>();
    const wifiString = `WIFI:T:${body.security};S:${body.ssid};P:${body.password};;`;
    const qrCodeDataUrl = await QRCode.toDataURL(wifiString);
    const data: WifiData = { ...body, qrCodeDataUrl };
    const element = React.createElement(WifiAccessCard, { wifi: data });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/asset", async (c) => {
  try {
    const body = await c.req.json<AssetData>();
    const assetUrl = `https://inventory.printy.mobile/asset/${body.assetId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(assetUrl);
    const data: AssetData = { ...body, qrCodeDataUrl };
    const element = React.createElement(AssetDeviceTag, { asset: data });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/pr", async (c) => {
  try {
    const body = await c.req.json<PullRequestData>();
    let qrCodeDataUrl = body.qrCodeDataUrl;
    if (body.url && !qrCodeDataUrl) {
      qrCodeDataUrl = await QRCode.toDataURL(body.url);
    }
    const data: PullRequestData = { ...body, qrCodeDataUrl };
    const element = React.createElement(PullRequestBoardingPass, { pr: data });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/release", async (c) => {
  try {
    const body = await c.req.json<ReleaseData>();
    let qrCodeDataUrl = body.qrCodeDataUrl;
    if (body.releaseNotesUrl && !qrCodeDataUrl) {
      qrCodeDataUrl = await QRCode.toDataURL(body.releaseNotesUrl);
    }
    const data: ReleaseData = { ...body, qrCodeDataUrl };
    const element = React.createElement(ReleaseDeploymentTag, {
      release: data,
    });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/build", async (c) => {
  try {
    const body = await c.req.json<BuildData>();
    const element = React.createElement(BuildReceipt, { build: body });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

printRoutes.post("/todo", async (c) => {
  try {
    const body = await c.req.json<TodoData>();
    const element = React.createElement(DailyTodoList, { todo: body });
    return renderPdfResponse(element);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

export default printRoutes;
