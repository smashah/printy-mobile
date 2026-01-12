import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const STYLES = [
  { id: "line-art", label: "Line Art", icon: "pen-tool" },
  { id: "doodle", label: "Doodle", icon: "edit-2" },
  { id: "detailed", label: "Detailed", icon: "image" },
  { id: "pixel", label: "Pixel Art", icon: "grid" },
  { id: "watercolor", label: "Watercolor", icon: "droplet" },
  { id: "cyberpunk", label: "Cyberpunk", icon: "zap" },
];

const HISTORY = [
  { id: 1, prompt: "A futuristic city floating in clouds", style: "Cyberpunk" },
  { id: 2, prompt: "Cute cat drinking coffee", style: "Doodle" },
  { id: 3, prompt: "Geometric mountain landscape", style: "Line Art" },
];

const MAGIC_PROMPTS = [
  "A cyberpunk detective searching for a lost android in a neon-lit alleyway",
  "A majestic owl with steampunk gears for eyes",
  "A serene japanese garden on Mars",
  "An underwater tea party with octopuses",
  "A retro 80s synthwave sunset over a grid landscape",
];

const INITIAL_CREDITS = 95;

export default function AiStudioScreen() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [credits] = useState(INITIAL_CREDITS);
  const [isFocused, setIsFocused] = useState(false);

  const handleMagic = () => {
    const randomPrompt =
      MAGIC_PROMPTS[Math.floor(Math.random() * MAGIC_PROMPTS.length)];
    setPrompt(randomPrompt);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      return;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-between p-6">
          <View className="mb-8 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold tracking-widest text-white">
                AI STUDIO
              </Text>
              <Text className="mt-1 text-xs tracking-wider uppercase text-slate-400">
                Magic Canvas
              </Text>
            </View>

            <View className="flex-row items-center space-x-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
              <View className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
              <Text className="text-xs font-medium text-slate-300">
                {credits} Credits
              </Text>
            </View>
          </View>

          <View className="relative mb-6 flex-1">
            <View
              className={`flex-1 border-l-2 pl-4 ${isFocused ? "border-purple-500" : "border-slate-700"}`}
            >
              <TextInput
                className="text-2xl font-light leading-9 text-white"
                placeholder="Describe what to draw..."
                placeholderTextColor="#64748b"
                multiline
                textAlignVertical="top"
                value={prompt}
                onChangeText={setPrompt}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  fontFamily:
                    Platform.OS === "ios" ? "Courier New" : "monospace",
                }}
              />
            </View>

            <Pressable
              onPress={handleMagic}
              className="absolute bottom-0 right-0 rounded-full border border-slate-700 bg-slate-900/80 p-3 active:bg-purple-900/50"
            >
              <FontAwesome5 name="dice" size={20} color="#a855f7" />
            </Pressable>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                Art Style
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-6 px-6"
              >
                {STYLES.map((style) => (
                  <Pressable
                    key={style.id}
                    onPress={() => setSelectedStyle(style.id)}
                    className={`mr-3 rounded-2xl border px-4 py-3 ${
                      selectedStyle === style.id
                        ? "border-purple-500/50 bg-purple-900/20"
                        : "border-slate-800 bg-slate-900"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        selectedStyle === style.id
                          ? "text-purple-300"
                          : "text-slate-400"
                      }`}
                    >
                      {style.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View>
              <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                Recent Creations
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-6 px-6"
              >
                {HISTORY.map((item) => (
                  <View
                    key={item.id}
                    className="mr-3 h-24 w-40 justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-3"
                  >
                    <Text
                      numberOfLines={2}
                      className="text-xs font-medium leading-5 text-slate-300"
                    >
                      {item.prompt}
                    </Text>
                    <View className="flex-row items-center space-x-1">
                      <View className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                      <Text className="text-[10px] uppercase text-slate-500">
                        {item.style}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <Pressable
              onPress={handleGenerate}
              disabled={!prompt.trim()}
              className={`flex-row items-center justify-center space-x-2 rounded-xl py-4 w-full ${
                prompt.trim()
                  ? "bg-white shadow-lg shadow-purple-500/20"
                  : "bg-slate-800 opacity-50"
              }`}
            >
              <MaterialCommunityIcons
                name="sparkles"
                size={20}
                color={prompt.trim() ? "#0f172a" : "#64748b"}
              />
              <Text
                className={`text-base font-bold tracking-wide ${
                  prompt.trim() ? "text-slate-950" : "text-slate-500"
                }`}
              >
                GENERATE (1 Credit)
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
