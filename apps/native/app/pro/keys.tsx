import { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, Share } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";

cssInterop(LinearGradient, {
  className: "style",
});

export default function BridgeKeysScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [key] = useState("pk_live_51M3m9XJq3XJq3XJq3XJq3XJq");

  const handleCopy = async () => {
    try {
      const result = await Share.share({
        message: key,
        title: "Printy Bridge Key",
      });
      
      if (result.action === Share.sharedAction) {
        Alert.alert("Success", "Key copied to clipboard!");
      }
    } catch {
      Alert.alert("Error", "Could not share key");
    }
  };

  const handleRevoke = () => {
    Alert.alert(
      "Roll Key",
      "Are you sure you want to revoke this key? Your existing bridge will disconnect immediately.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Revoke & Replace",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Key rolled successfully.");
          },
        },
      ]
    );
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
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800"
            >
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <View className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <Text className="text-xs font-bold tracking-widest text-emerald-400">
                SECURE
              </Text>
            </View>
          </View>

          <View className="mb-8 mt-4 items-center px-6">
            <View className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800 shadow-lg shadow-black/50">
              <MaterialCommunityIcons name="shield-key-outline" size={32} color="#10b981" />
            </View>
            <Text className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Headless Connection
            </Text>
            <Text className="text-center text-3xl font-bold leading-tight text-white">
              Bridge Keys
            </Text>
            <Text className="mt-4 max-w-[280px] text-center text-sm leading-relaxed text-neutral-400">
              Use these keys to connect a headless device (Raspberry Pi) to your account.
            </Text>
          </View>

          <View className="mb-8 px-6">
            <LinearGradient
              colors={["#262626", "#171717"]}
              className="rounded-3xl border border-neutral-800 p-1"
            >
              <View className="rounded-[20px] bg-neutral-900/80 p-5">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    API Key
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => setIsVisible(!isVisible)}
                      className="rounded-lg bg-neutral-800 p-2 active:bg-neutral-700"
                    >
                      <Feather
                        name={isVisible ? "eye-off" : "eye"}
                        size={16}
                        color="#9ca3af"
                      />
                    </Pressable>
                  </View>
                </View>

                <View className="mb-6 overflow-hidden rounded-xl border border-neutral-800/50 bg-black/40">
                  <View className="flex-row items-center p-4">
                    <Text 
                      className={`flex-1 font-mono text-sm ${isVisible ? "text-emerald-400" : "tracking-[4px] text-neutral-600"}`}
                      numberOfLines={1}
                    >
                      {isVisible ? key : "•••••••••••••••••••••••••"}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={handleCopy}
                  className="flex w-full flex-row items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800 py-3 active:bg-neutral-700"
                >
                  <Feather name="copy" size={16} color="#e5e5e5" />
                  <Text className="ml-2 text-sm font-medium text-white">
                    Copy Key
                  </Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          <View className="mb-12 px-6">
            <Text className="mb-4 text-sm font-medium text-neutral-400">
              Installation Command
            </Text>
            <View className="rounded-xl border border-neutral-800 bg-black p-4">
              <Text className="font-mono text-xs leading-5 text-neutral-300">
                <Text className="text-emerald-500">npx</Text> printy-bridge start{"\n"}
                <Text className="text-neutral-500">--key</Text> {isVisible ? key : "pk_live_..."}
              </Text>
            </View>
            <Text className="mt-3 text-xs text-neutral-500">
              Run this command on your device terminal to start the bridge service.
            </Text>
          </View>

          <View className="mt-auto px-6">
            <Pressable
              onPress={handleRevoke}
              className="flex flex-row items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 py-4 active:bg-red-500/10"
            >
              <Feather name="rotate-cw" size={16} color="#ef4444" />
              <Text className="ml-2 text-sm font-bold text-red-500">
                ROLL KEY
              </Text>
            </Pressable>
            <Text className="mt-4 text-center text-xs text-neutral-600">
              Revoking will disconnect all active bridges using this key.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
