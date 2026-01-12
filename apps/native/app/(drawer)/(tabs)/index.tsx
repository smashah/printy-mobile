import { Container } from "@/components/container";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

type Template = {
  id: string;
  title: string;
  category: "Utility" | "Fun" | "Dev" | "Home";
  tag: "FREE" | "PRO";
  icon: keyof typeof Feather.glyphMap;
};

const TEMPLATES: Template[] = [
  {
    id: "1",
    title: "WIFI CARD",
    category: "Utility",
    tag: "FREE",
    icon: "wifi",
  },
  {
    id: "2",
    title: "TODO LIST",
    category: "Utility",
    tag: "FREE",
    icon: "check-square",
  },
  { id: "3", title: "QR ASSET", category: "Utility", tag: "PRO", icon: "box" },
  {
    id: "4",
    title: "GITHUB ISSUE",
    category: "Dev",
    tag: "FREE",
    icon: "github",
  },
  { id: "5", title: "RECIPE", category: "Home", tag: "FREE", icon: "coffee" },
  { id: "6", title: "RELEASE TAG", category: "Dev", tag: "PRO", icon: "tag" },
  { id: "7", title: "COLORING", category: "Fun", tag: "FREE", icon: "image" },
  { id: "8", title: "BOARDING PASS", category: "Fun", tag: "PRO", icon: "map" },
];

const CATEGORIES = ["All", "Utility", "Dev", "Home", "Fun"];

const handlePress = () => null;

const ConnectionBadge = () => {
  const isConnected = true;

  return (
    <Pressable
      className={`flex-row items-center px-3 py-1.5 border-2 border-black rounded-full ${
        isConnected ? "bg-green-100" : "bg-red-100"
      }`}
      onPress={handlePress}
    >
      <View
        className={`mr-2 h-2 w-2 rounded-full ${
          isConnected ? "bg-green-600" : "bg-red-600"
        }`}
      />
      <Text className="font-mono text-xs font-bold uppercase text-black">
        {isConnected ? "PM-241-BT" : "OFFLINE"}
      </Text>
    </Pressable>
  );
};

const CategoryTab = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`mr-2 px-4 py-2 border-2 border-black rounded-md ${
      isActive ? "bg-black" : "bg-white"
    }`}
  >
    <Text
      className={`text-sm font-bold uppercase ${
        isActive ? "text-white" : "text-black"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);

const TemplateCard = ({ item }: { item: Template }) => (
  <Pressable
    className="overflow-hidden flex-1 m-2 bg-white border-2 border-black rounded-lg active:opacity-90"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 0,
      elevation: 4,
    }}
    onPress={handlePress}
  >
    <View className="relative flex items-center justify-center p-4 h-32 bg-gray-100 border-b-2 border-black">
      <Feather name={item.icon} size={48} color="black" />

      <View className="absolute right-2 top-2 px-2 py-0.5 bg-black rounded-sm">
        <Text className="text-[10px] font-bold text-white">{item.tag}</Text>
      </View>
    </View>

    <View className="p-3 bg-white">
      <Text
        className="mb-1 font-mono text-sm font-bold text-black"
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <Text className="font-mono text-xs uppercase text-gray-500">
        {item.category}
      </Text>
    </View>
  </Pressable>
);

export default function DashboardScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates =
    selectedCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 px-2 pt-4 bg-gray-50">
        <View className="flex-row items-center justify-between mb-6 px-2">
          <View>
            <Text className="text-3xl font-black uppercase tracking-tighter text-black">
              Blueprints
            </Text>
            <Text className="font-mono text-xs uppercase tracking-widest text-gray-500">
              Printy OS v1.0
            </Text>
          </View>
          <ConnectionBadge />
        </View>

        <View className="mb-6 px-2">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <CategoryTab
                label={item}
                isActive={selectedCategory === item}
                onPress={() => setSelectedCategory(item)}
              />
            )}
            contentContainerStyle={{ paddingRight: 16 }}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-2 px-2">
            <Text className="text-lg font-black uppercase text-black">
              Fresh Ink
            </Text>
            <Pressable>
              <Text className="font-mono text-xs underline text-gray-500">
                View All
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={filteredTemplates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TemplateCard item={item} />}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 100 }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <Pressable
        className="absolute bottom-6 right-6 flex items-center justify-center h-14 w-14 bg-black border-2 border-white rounded-full shadow-lg active:scale-95"
        style={{ elevation: 5 }}
      >
        <Feather name="plus" size={24} color="white" />
      </Pressable>
    </Container>
  );
}
