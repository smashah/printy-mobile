import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "nativewind/theme";

const PRINT_DELAY = 2000;
const LABEL_WIDTH = 288;
const LABEL_HEIGHT = 432;
const QR_GRID_SIZE = 64;
const QR_THRESHOLD = 0.5;
const MIN_BOTTOM_PADDING = 20;
const ACTION_BAR_TOP_PADDING = 16;
const SCROLL_BOTTOM_PADDING = 120;

export default function TemplateEditorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [formData, setFormData] = useState({
    ssid: "MyWiFi_Network",
    password: "supersecretpassword",
    security: "WPA/WPA2",
  });
  const [copies, setCopies] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    await new Promise((resolve) => setTimeout(resolve, PRINT_DELAY));
    setIsPrinting(false);
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Template Editor",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "transparent" },
          headerTintColor: "hsl(var(--foreground))",
          headerRight: () => (
            <Pressable className="p-2 active:opacity-70">
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color="hsl(var(--foreground))"
              />
            </Pressable>
          ),
        }}
      />

      <View className="flex-row border-b border-border/50 bg-background px-4 py-2">
        <View className="flex-1 flex-row rounded-lg bg-secondary/50 p-1">
          <Pressable
            onPress={() => setActiveTab("edit")}
            className={`flex-1 items-center justify-center rounded-md py-2 ${activeTab === "edit" ? "bg-background shadow-sm" : ""}`}
          >
            <Text
              className={`font-medium ${activeTab === "edit" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Edit
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("preview")}
            className={`flex-1 items-center justify-center rounded-md py-2 ${activeTab === "preview" ? "bg-background shadow-sm" : ""}`}
          >
            <Text
              className={`font-medium ${activeTab === "preview" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Preview
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="relative flex-1">
        <View className={`flex-1 ${activeTab === "edit" ? "flex" : "hidden"}`}>
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: SCROLL_BOTTOM_PADDING,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="space-y-6">
              <View className="space-y-4">
                <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Network Details
                </Text>

                <View className="space-y-2">
                  <Text className="text-base font-medium text-foreground">
                    SSID (Network Name)
                  </Text>
                  <TextInput
                    value={formData.ssid}
                    onChangeText={(text) => updateField("ssid", text)}
                    className="rounded-xl border border-border bg-card p-4 text-base text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter network name"
                    placeholderTextColor="hsl(var(--muted-foreground))"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-base font-medium text-foreground">
                    Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={formData.password}
                      onChangeText={(text) => updateField("password", text)}
                      className="rounded-xl border border-border bg-card p-4 pr-12 text-base text-foreground"
                      placeholder="Enter password"
                      secureTextEntry
                      placeholderTextColor="hsl(var(--muted-foreground))"
                    />
                    <View className="absolute right-4 top-4">
                      <Ionicons
                        name="eye-off-outline"
                        size={20}
                        color="hsl(var(--muted-foreground))"
                      />
                    </View>
                  </View>
                </View>

                <View className="space-y-2">
                  <Text className="text-base font-medium text-foreground">
                    Security Type
                  </Text>
                  <View className="overflow-hidden rounded-xl border border-border bg-card">
                    {["WPA/WPA2", "WEP", "Open"].map((type, index) => (
                      <Pressable
                        key={type}
                        onPress={() => updateField("security", type)}
                        className={`flex-row items-center justify-between p-4 active:bg-secondary/50 ${index !== 2 ? "border-b border-border/50" : ""}`}
                      >
                        <Text className="text-base text-foreground">
                          {type}
                        </Text>
                        {formData.security === type && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color="hsl(var(--primary))"
                          />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <View className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                <View className="flex-row gap-3">
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color="hsl(var(--primary))"
                  />
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold text-foreground">
                      Did you know?
                    </Text>
                    <Text className="text-sm leading-5 text-muted-foreground">
                      The generated QR code will allow devices to connect
                      instantly without typing the password.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <View
          className={`flex-1 bg-secondary/30 ${activeTab === "preview" ? "flex" : "hidden"}`}
        >
          <View className="flex-1 items-center justify-center p-8">
            <View
              className="relative w-full max-w-[320px] overflow-hidden bg-white shadow-lg"
              style={{
                borderRadius: 0,
                aspectRatio: LABEL_WIDTH / LABEL_HEIGHT,
              }}
            >
              <View className="absolute inset-0 bg-white" />

              <View className="m-2 flex-1 items-center justify-between border-[0px] border-dashed border-black p-6">
                <View className="w-full items-center space-y-2 pt-4">
                  <Ionicons name="wifi" size={48} color="black" />
                  <Text className="text-center font-mono text-2xl font-black uppercase tracking-tighter text-black">
                    WiFi Access
                  </Text>
                  <View className="my-2 h-0.5 w-full bg-black" />
                </View>

                <View className="h-48 w-48 items-center justify-center bg-black">
                  <View className="h-44 w-44 items-center justify-center bg-white">
                    <View className="flex-row flex-wrap h-full w-full p-2">
                      {Array.from({ length: QR_GRID_SIZE }).map((_, i) => (
                        <View
                          key={i}
                          className={`h-[12.5%] w-[12.5%] ${Math.random() > QR_THRESHOLD ? "bg-black" : "bg-white"}`}
                        />
                      ))}
                    </View>
                  </View>
                </View>

                <View className="w-full space-y-3 pb-4">
                  <View className="space-y-1">
                    <Text className="font-mono text-xs uppercase text-black">
                      SSID
                    </Text>
                    <Text
                      className="font-mono text-lg font-bold text-black"
                      numberOfLines={1}
                    >
                      {formData.ssid || "Unknown"}
                    </Text>
                  </View>

                  <View className="space-y-1">
                    <Text className="font-mono text-xs uppercase text-black">
                      Password
                    </Text>
                    <Text
                      className="font-mono text-lg font-bold text-black"
                      numberOfLines={1}
                    >
                      {formData.password || "********"}
                    </Text>
                  </View>
                </View>

                <Text className="mt-2 w-full text-center font-mono text-[10px] text-black">
                  generated by printy
                </Text>
              </View>
            </View>

            <Text className="mt-8 text-sm font-medium text-muted-foreground">
              4" x 6" Thermal Label Preview
            </Text>
          </View>
        </View>

        <View
          className="absolute bottom-0 left-0 right-0 border-t border-border bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
          style={{
            paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING),
            paddingTop: ACTION_BAR_TOP_PADDING,
          }}
        >
          <View className="flex-row items-center gap-4 px-4">
            <View className="flex-row items-center rounded-full border border-border bg-secondary p-1">
              <Pressable
                onPress={() => setCopies(Math.max(1, copies - 1))}
                className="h-10 w-10 items-center justify-center rounded-full active:bg-background"
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color="hsl(var(--foreground))"
                />
              </Pressable>

              <Text className="w-8 text-center text-lg font-bold text-foreground">
                {copies}
              </Text>

              <Pressable
                onPress={() => setCopies(copies + 1)}
                className="h-10 w-10 items-center justify-center rounded-full active:bg-background"
              >
                <Ionicons name="add" size={20} color="hsl(var(--foreground))" />
              </Pressable>
            </View>

            <Pressable
              onPress={handlePrint}
              disabled={isPrinting}
              className="flex-1 flex-row items-center justify-center h-14 rounded-full bg-primary shadow-lg shadow-blue-500/30 active:scale-[0.98]"
            >
              <Ionicons
                name="print-outline"
                size={24}
                color="white"
                className="mr-2"
              />
              <Text className="text-lg font-bold text-white">PRINT LABEL</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal transparent visible={isPrinting} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[80%] max-w-[300px] items-center rounded-3xl bg-background p-8 shadow-2xl">
            <ActivityIndicator size="large" color="hsl(var(--primary))" />
            <Text className="mt-4 text-xl font-bold text-foreground">
              Sending...
            </Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Sending {copies} cop{copies !== 1 ? "ies" : "y"} to printer
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
