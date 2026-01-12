import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MOCK_RECIPE = {
  title: "Classic Carbonara",
  servings: "4",
  time: "30 min",
  ingredients: [
    { id: "i1", text: "400g spaghetti" },
    { id: "i2", text: "200g guanciale or pancetta, cubed" },
    { id: "i3", text: "4 large eggs" },
    { id: "i4", text: "100g Pecorino Romano, grated" },
    { id: "i5", text: "Freshly ground black pepper" },
  ],
  steps: [
    { id: "s1", text: "Bring a large pot of salted water to a boil." },
    {
      id: "s2",
      text: "Cook the guanciale in a skillet over medium heat until crispy.",
    },
    {
      id: "s3",
      text: "Whisk eggs and cheese in a bowl with plenty of pepper.",
    },
    {
      id: "s4",
      text: "Cook pasta until al dente, reserving some pasta water.",
    },
    {
      id: "s5",
      text: "Toss hot pasta with pork fat, then remove from heat and mix in egg mixture quickly.",
    },
    { id: "s6", text: "Serve immediately with more cheese and pepper." },
  ],
};

const LOADING_STEPS = [
  "Connecting to site...",
  "Scraping ingredients...",
  "Parsing instructions...",
  "Formatting recipe...",
];

const ANIMATION_INTERVAL = 800;

const RADIX = 36;
const SUBSTR_START = 2;
const SUBSTR_LENGTH = 9;

const generateId = () =>
  Math.random().toString(RADIX).substr(SUBSTR_START, SUBSTR_LENGTH);

export default function RecipeImportScreen() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "editing">("idle");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [recipe, setRecipe] = useState({
    title: "",
    servings: "",
    time: "",
    ingredients: [{ id: "1", text: "" }],
    steps: [{ id: "1", text: "" }],
  });

  const finishLoading = useCallback(() => {
    setStatus("editing");
    setRecipe(MOCK_RECIPE);
  }, []);

  useEffect(() => {
    if (status === "loading") {
      const interval = setInterval(() => {
        setLoadingStepIndex((prev) => {
          if (prev >= LOADING_STEPS.length - 1) {
            clearInterval(interval);
            finishLoading();
            return prev;
          }
          return prev + 1;
        });
      }, ANIMATION_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [status, finishLoading]);

  const handleImport = () => {
    if (!url) {
      return;
    }
    setStatus("loading");
    setLoadingStepIndex(0);
  };

  const handleManualEntry = () => {
    setStatus("editing");
    setRecipe({
      title: "",
      servings: "2",
      time: "45 min",
      ingredients: [
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
      ],
      steps: [
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
      ],
    });
  };

  const updateIngredient = (text: string, index: number) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], text };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { id: generateId(), text: "" }],
    });
  };

  const updateStep = (text: string, index: number) => {
    const newSteps = [...recipe.steps];
    newSteps[index] = { ...newSteps[index], text };
    setRecipe({ ...recipe, steps: newSteps });
  };

  const addStep = () => {
    setRecipe({
      ...recipe,
      steps: [...recipe.steps, { id: generateId(), text: "" }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="py-8">
            <Pressable onPress={() => router.back()} className="mb-6">
              <Ionicons
                name="arrow-back"
                size={24}
                className="text-foreground"
              />
            </Pressable>
            <Text className="text-4xl font-serif tracking-tight text-foreground">
              RECIPE
            </Text>
            <Text className="mt-2 text-lg text-muted-foreground">
              Sous-chef. Helpful and organized.
            </Text>
          </View>

          {(status === "idle" || status === "loading") && (
            <View className="mt-10 flex-col gap-6">
              <View className="rounded-xl border border-border bg-card p-1 shadow-sm">
                <TextInput
                  className="px-4 py-4 text-lg bg-transparent text-foreground"
                  placeholder="Paste URL..."
                  placeholderTextColor="hsl(var(--muted-foreground))"
                  value={url}
                  onChangeText={setUrl}
                  editable={status === "idle"}
                />
              </View>

              <Pressable
                onPress={handleImport}
                disabled={status === "loading" || !url}
                className={`items-center justify-center rounded-xl bg-primary py-4 shadow-md active:opacity-90 ${
                  status === "loading" || !url ? "opacity-50" : ""
                }`}
              >
                {status === "loading" ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-bold text-primary-foreground">
                    Import Recipe
                  </Text>
                )}
              </Pressable>

              {status === "loading" && (
                <View className="items-center space-y-2 py-4">
                  <Text className="animate-pulse text-lg font-medium text-primary">
                    {LOADING_STEPS[loadingStepIndex]}
                  </Text>
                </View>
              )}

              {status === "idle" && (
                <Pressable
                  onPress={handleManualEntry}
                  className="items-center py-4"
                >
                  <Text className="text-lg text-muted-foreground underline decoration-muted-foreground/50">
                    Or write manually
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {status === "editing" && (
            <View className="pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <View className="mb-8 space-y-6">
                <TextInput
                  className="pb-2 text-3xl font-serif font-bold text-foreground border-b border-border"
                  placeholder="Recipe Title"
                  value={recipe.title}
                  onChangeText={(text) => setRecipe({ ...recipe, title: text })}
                  multiline
                />

                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                      Servings
                    </Text>
                    <TextInput
                      className="p-3 font-medium rounded-lg border border-border bg-card text-foreground"
                      value={recipe.servings}
                      onChangeText={(text) =>
                        setRecipe({ ...recipe, servings: text })
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                      Time
                    </Text>
                    <TextInput
                      className="p-3 font-medium rounded-lg border border-border bg-card text-foreground"
                      value={recipe.time}
                      onChangeText={(text) =>
                        setRecipe({ ...recipe, time: text })
                      }
                    />
                  </View>
                </View>
              </View>

              <View className="mb-8">
                <Text className="mb-4 pb-2 text-xl font-serif font-semibold text-foreground border-b border-border/50">
                  Ingredients
                </Text>
                <View className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <View key={ing.id} className="flex-row items-center gap-3">
                      <View className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <TextInput
                        className="flex-1 pb-1 text-lg text-foreground border-b border-dashed border-border/50"
                        value={ing.text}
                        onChangeText={(text) => updateIngredient(text, i)}
                        placeholder="Add ingredient..."
                        placeholderTextColor="hsl(var(--muted-foreground))"
                        multiline
                      />
                    </View>
                  ))}
                  <Pressable
                    onPress={addIngredient}
                    className="mt-2 flex-row items-center gap-2 opacity-60"
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      className="text-foreground"
                    />
                    <Text className="text-foreground">Add Ingredient</Text>
                  </Pressable>
                </View>
              </View>

              <View className="mb-8">
                <Text className="mb-4 pb-2 text-xl font-serif font-semibold text-foreground border-b border-border/50">
                  Instructions
                </Text>
                <View className="space-y-6">
                  {recipe.steps.map((step, i) => (
                    <View key={step.id} className="flex-row gap-4">
                      <Text className="-mt-1 text-3xl font-serif font-bold text-muted-foreground/30">
                        {i + 1}
                      </Text>
                      <TextInput
                        className="flex-1 pt-1 text-lg leading-relaxed text-foreground"
                        value={step.text}
                        onChangeText={(text) => updateStep(text, i)}
                        placeholder="Describe step..."
                        placeholderTextColor="hsl(var(--muted-foreground))"
                        multiline
                      />
                    </View>
                  ))}
                  <Pressable
                    onPress={addStep}
                    className="mt-2 flex-row items-center gap-2 opacity-60"
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      className="text-foreground"
                    />
                    <Text className="text-foreground">Add Step</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable className="mb-10 mt-4 items-center justify-center py-4 rounded-xl bg-primary shadow-md active:opacity-90">
                <Text className="text-lg font-bold text-primary-foreground">
                  Save to Cookbook
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
