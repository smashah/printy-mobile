import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

const RESULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1542204637-e67bc7d41e48?q=80&w=800&auto=format&fit=crop&grayscale";

const animationConfig = {
  blinkDuration: 800,
  blinkMinOpacity: 0.3,
  developDelay: 2000,
  developDuration: 3000,
  doneDelay: 5000,
  fadeDelay: 200,
  fadeDuration: 500,
  bezierX1: 0.25,
  bezierY1: 0.1,
  bezierX2: 0.25,
  bezierY2: 1,
};

const bezierEasing = Easing.bezier(
  animationConfig.bezierX1,
  animationConfig.bezierY1,
  animationConfig.bezierX2,
  animationConfig.bezierY2,
);

export default function AiResultScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<"dreaming" | "developing" | "done">(
    "dreaming",
  );
  const [isZoomed, setIsZoomed] = useState(false);

  const imageOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(1);

  useEffect(() => {
    textOpacity.value = withRepeat(
      withSequence(
        withTiming(animationConfig.blinkMinOpacity, {
          duration: animationConfig.blinkDuration,
        }),
        withTiming(1, { duration: animationConfig.blinkDuration }),
      ),
      -1,
      true,
    );

    const developTimer = setTimeout(() => {
      setStatus("developing");
      imageOpacity.value = withTiming(1, {
        duration: animationConfig.developDuration,
        easing: bezierEasing,
      });
    }, animationConfig.developDelay);

    const doneTimer = setTimeout(() => {
      setStatus("done");
      textOpacity.value = 0;
    }, animationConfig.doneDelay);

    return () => {
      clearTimeout(developTimer);
      clearTimeout(doneTimer);
    };
  }, [imageOpacity, textOpacity]);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const handlePrint = () => {
    router.push("/modal");
  };

  return (
    <View className="bg-zinc-950 flex-1">
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center relative">
        {status === "dreaming" && (
          <Animated.View
            className="absolute inset-0 items-center justify-center z-10"
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Animated.Text
              style={[textStyle]}
              className="font-mono text-emerald-500 text-xl tracking-widest"
            >
              DREAMING...
            </Animated.Text>
            <Text className="font-mono mt-4 text-xs text-zinc-600">
              GENERATING PIXELS
            </Text>
          </Animated.View>
        )}

        <Pressable
          onPress={() => setIsZoomed(!isZoomed)}
          className={`bg-zinc-900 border-zinc-800 duration-300 overflow-hidden shadow-2xl transition-all ${isZoomed ? "border-0 h-full w-full" : "aspect-[2/3] border-4 w-[85%]"}`}
        >
          <View className="absolute bg-zinc-950 inset-0 z-0" />

          <Animated.Image
            source={{ uri: RESULT_IMAGE_URL }}
            className="h-full w-full"
            style={[imageStyle]}
            resizeMode="cover"
          />

          {status === "developing" && (
            <View className="absolute bg-black/50 bottom-4 px-2 py-1 right-4 rounded">
              <Text className="font-mono text-[10px] text-emerald-500/80">
                DEVELOPING...
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {status === "done" && !isZoomed && (
        <Animated.View
          entering={FadeIn.duration(animationConfig.fadeDuration).delay(
            animationConfig.fadeDelay,
          )}
          className="bg-zinc-900/90 border-t border-zinc-800 gap-6 pb-8 pt-4 px-6"
        >
          <View className="flex-row justify-center mb-2 space-x-8">
            <Pressable className="active:opacity-50 p-2">
              <Ionicons name="thumbs-down-outline" size={24} color="#71717a" />
            </Pressable>
            <Text className="font-mono self-center text-xs text-zinc-500">
              FEEDBACK
            </Text>
            <Pressable className="active:opacity-50 p-2">
              <Ionicons name="thumbs-up-outline" size={24} color="#71717a" />
            </Pressable>
          </View>

          <View className="flex-row gap-4 items-center">
            <Pressable
              className="active:bg-zinc-700 bg-zinc-800 border border-zinc-700 flex-1 h-12 items-center justify-center rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="font-bold text-zinc-300 tracking-wide">
                REMIX
              </Text>
            </Pressable>

            <Pressable
              className="active:bg-emerald-400 bg-emerald-500 flex-[2] h-14 items-center justify-center rounded-lg shadow-emerald-900/20 shadow-lg"
              onPress={handlePrint}
            >
              <View className="flex-row gap-2 items-center">
                <Ionicons name="print" size={20} color="#000" />
                <Text className="font-black text-lg text-zinc-950 tracking-wider">
                  PRINT
                </Text>
              </View>
            </Pressable>

            <Pressable className="active:bg-zinc-700 bg-zinc-800 border border-zinc-700 flex-1 h-12 items-center justify-center rounded-lg">
              <Ionicons name="download-outline" size={24} color="#d4d4d8" />
            </Pressable>
          </View>
        </Animated.View>
      )}

      {isZoomed && (
        <Pressable
          onPress={() => setIsZoomed(false)}
          className="absolute bg-black/50 p-2 right-6 rounded-full top-12 z-50"
        >
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}
