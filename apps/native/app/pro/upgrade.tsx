import React from "react";
import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";

cssInterop(LinearGradient, {
  className: "style",
});

export default function ProUpgradeScreen() {
  const router = useRouter();

  const handleUpgrade = () => {
    console.log("Upgrade to Pro initiated");
    alert("Mock Payment: Success! Welcome to Pro.");
    router.back();
  };

  const handleRestore = () => {
    console.log("Restore purchases initiated");
    alert("Mock Restore: No purchases found.");
  };

  return (
    <View className="flex-1 bg-neutral-900">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable
              onPress={() => router.back()}
              className="items-center justify-center w-10 h-10 bg-neutral-800 rounded-full"
            >
              <Feather name="x" size={20} color="#fff" />
            </Pressable>
            <View className="px-3 py-1 bg-[#FFD600] rounded-full">
              <Text className="text-xs font-bold tracking-widest text-black">
                PRO
              </Text>
            </View>
          </View>

          <View className="items-center px-6 mt-4 mb-8">
            <Text className="mb-4 text-xs font-medium tracking-[0.2em] text-neutral-400">
              MEMBERSHIP
            </Text>
            <Text className="text-4xl font-bold leading-tight text-center text-white">
              UNLOCK THE{"\n"}BRIDGE
            </Text>
          </View>

          <View className="items-center justify-center px-4 mb-12">
            <View className="relative w-full aspect-[1.6] max-w-[340px]">
              <View className="absolute inset-0 translate-y-4 scale-90 transform bg-[#FFD600] opacity-20 blur-2xl rounded-3xl" />

              <LinearGradient
                colors={["#1a1a1a", "#262626"]}
                className="flex-1 overflow-hidden border border-white/10 rounded-3xl"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LinearGradient
                  colors={["#FFD600", "#FFA500", "#FFD600"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute top-0 w-full h-1"
                />

                <View className="relative flex-1 justify-between p-6 overflow-hidden">
                  <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-2xl rounded-full" />
                  <View className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FFD600]/10 blur-2xl rounded-full" />

                  <View className="flex-row items-start justify-between">
                    <MaterialCommunityIcons
                      name="ticket-confirmation-outline"
                      size={32}
                      color="#FFD600"
                    />
                    <View className="items-end">
                      <Text className="text-[10px] font-mono tracking-widest text-neutral-500">
                        TIER
                      </Text>
                      <Text className="text-lg font-bold text-white">
                        PROFESSIONAL
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-end justify-between">
                    <View>
                      <Text className="mb-1 text-[10px] font-mono tracking-widest text-neutral-500">
                        ID
                      </Text>
                      <Text className="text-xs font-mono text-neutral-300">
                        8829-PRO-ACCESS
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-2xl font-bold text-[#FFD600]">
                        $5.00
                      </Text>
                      <Text className="text-[10px] uppercase text-neutral-500">
                        per month
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="absolute bottom-0 flex-row justify-between w-full h-4 px-4">
                  {[...Array(15)].map((_, i) => (
                    <View
                      key={i}
                      className="w-2 h-2 -mb-1 bg-neutral-900 rounded-full"
                    />
                  ))}
                </View>
              </LinearGradient>
            </View>
          </View>

          <View className="px-8 mb-10">
            {[
              "100 AI Generation Credits",
              "Cloud Bridge Access",
              "Webhook Integrations",
              "Priority Support",
            ].map((feature, index) => (
              <View key={index} className="flex-row items-center mb-5">
                <View className="items-center justify-center w-6 h-6 mr-4 bg-[#FFD600]/20 rounded-full">
                  <Feather name="check" size={14} color="#FFD600" />
                </View>
                <Text className="text-base font-medium text-neutral-200">
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-1" />

          <View className="px-6 mt-auto">
            <View className="items-center mb-6">
              <Text className="mb-1 text-sm text-neutral-400">Total</Text>
              <View className="flex-row items-baseline">
                <Text className="mr-2 text-4xl font-medium font-mono tracking-tighter text-white">
                  $5.00
                </Text>
                <Text className="text-lg text-neutral-400">/ mo</Text>
              </View>
              <Text className="mt-1 text-xs text-neutral-500">
                Cancel anytime.
              </Text>
            </View>

            <Pressable
              onPress={handleUpgrade}
              className="w-full overflow-hidden transition-all rounded-xl active:scale-[0.99] active:opacity-90"
            >
              <LinearGradient
                colors={["#2E5CFF", "#0047FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="items-center justify-center py-4"
              >
                <Text className="text-lg font-bold tracking-wide text-white">
                  UPGRADE TO PRO
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleRestore}
              className="items-center py-2 mt-6"
            >
              <Text className="text-xs font-medium text-neutral-500">
                Restore Purchases
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
