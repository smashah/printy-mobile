import type { RecipeData } from "../types";

interface RawIngredient {
  name: string;
  quantity?: {
    value?: {
      value?: {
        value?: number | string;
      };
    };
    unit?: string;
  };
}

interface RawCookware {
  name: string;
}

interface RawStepItem {
  type: string;
  value?: string;
  index?: number;
  quantity?: {
    value?: {
      value?: number | string;
    };
    unit?: string;
  };
}

interface RawSection {
  content?: Array<{
    type: string;
    value?: {
      items?: RawStepItem[];
    };
  }>;
}

interface RawRecipe {
  ingredients?: RawIngredient[];
  cookware?: RawCookware[];
  sections?: RawSection[];
  steps?: Array<string | { value: string }>;
  metadata?: {
    title?: string;
    image?: string;
    map?: Record<string, string> & { source?: string };
  };
}

export function parseRecipeJson(raw: RawRecipe, name: string): RecipeData {
  const ingredients = (raw.ingredients || []).map((ing) => ({
    name: ing.name,
    quantity: ing.quantity?.value?.value?.value
      ? String(ing.quantity.value.value.value)
      : "",
    unit: ing.quantity?.unit || "",
  }));

  const cookware = (raw.cookware || []).map((c) => ({
    name: c.name,
  }));

  const steps: string[] = [];
  if (raw.sections) {
    for (const section of raw.sections) {
      if (section.content) {
        for (const stepItem of section.content) {
          if (stepItem.type === "step" && stepItem.value?.items) {
            let stepText = "";
            for (const item of stepItem.value.items) {
              if (item.type === "text") {
                stepText += item.value;
              } else if (
                item.type === "ingredient" &&
                item.index !== undefined
              ) {
                const ingName =
                  raw.ingredients?.[item.index]?.name || "ingredient";
                stepText += ingName;
              } else if (item.type === "cookware" && item.index !== undefined) {
                const cookName = raw.cookware?.[item.index]?.name || "cookware";
                stepText += cookName;
              } else if (item.type === "timer") {
                stepText +=
                  `${item.quantity?.value?.value || ""} ${item.quantity?.unit || ""}`.trim();
              }
            }
            steps.push(stepText);
          }
        }
      }
    }
  }

  if (steps.length === 0 && raw.steps) {
    for (const s of raw.steps) {
      if (typeof s === "string") {
        steps.push(s);
      } else if (s.value) {
        steps.push(s.value);
      }
    }
  }

  return {
    title: raw.metadata?.map?.source ? name : raw.metadata?.title || name,
    ingredients,
    cookware,
    steps,
    metadata: raw.metadata?.map,
    image: raw.metadata?.image,
  };
}
