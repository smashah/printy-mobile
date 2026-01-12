/* eslint-disable react-native/no-inline-styles */
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// biome-ignore lint/nursery/useSortedClasses: Sorting classes manually is error-prone in this environment
type AuthButtonProps = {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  variant: "primary" | "secondary" | "outline";
  className?: string;
  loading?: boolean;
};

const ANIMATION_DURATION = 500;
const EXIT_DURATION = 800;
const EXIT_TRANSLATE_Y = 1000;
const SPRING_DAMPING = 12;
const SPRING_STIFFNESS = 90;
const SPRING_MASS = 1;
const CARD_PERSPECTIVE = 1000;
const BEZIER_X1 = 0.25;
const BEZIER_Y1 = 0.1;
const BEZIER_X2 = 0.25;
const BEZIER_Y2 = 1;
const MAX_CARD_WIDTH = 360;
const TARGET_ROTATION = 0;
const INITIAL_ROTATION = 90;

const AuthButton = ({
  onPress,
  icon,
  label,
  variant,
  className,
  loading,
}: AuthButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses =
    "flex-row items-center justify-center mb-3 px-4 py-3 border-2";

  const variantClasses = {
    primary: "bg-black border-black dark:bg-white dark:border-white",
    secondary: "bg-white border-black dark:bg-zinc-900 dark:border-white",
    outline: "bg-transparent border-dashed border-black dark:border-white",
  };

  const textClasses = {
    primary: "font-bold text-white dark:text-black",
    secondary: "font-bold text-black dark:text-white",
    outline: "font-medium text-black dark:text-white",
  };

  const getIconColor = () => {
    if (variant === "primary") {
      return "white";
    }
    return "black";
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={loading}
      className={`${baseClasses} ${variantClasses[variant]} ${isPressed ? "scale-[0.98] opacity-80" : ""} ${loading ? "opacity-50" : ""} ${className}`}
      style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={Platform.OS === "ios" ? getIconColor() : getIconColor()}
          style={{
            marginRight: 10,
            color: getIconColor(),
          }}
        />
      )}
      <Text
        className={`${textClasses[variant]} font-mono uppercase tracking-wider`}
      >
        {loading ? "PROCESSING..." : label}
      </Text>
    </Pressable>
  );
};

export default function SignInScreen() {
  const router = useRouter();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const cardRotation = useSharedValue(INITIAL_ROTATION);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    cardRotation.value = withSpring(TARGET_ROTATION, {
      damping: SPRING_DAMPING,
      stiffness: SPRING_STIFFNESS,
      mass: SPRING_MASS,
    });
  }, [cardOpacity, cardRotation]);

  const animateSuccess = () => {
    cardTranslateY.value = withTiming(
      EXIT_TRANSLATE_Y,
      {
        duration: EXIT_DURATION,
        easing: Easing.bezier(BEZIER_X1, BEZIER_Y1, BEZIER_X2, BEZIER_Y2),
      },
      (finished) => {
        if (finished) {
          runOnJS(router.replace)("/");
        }
      },
    );
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider,
        "callbackURL": "/dashboard",
      });
      animateSuccess();
    } catch {
      Alert.alert("Error", "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email) {
      return;
    }
    try {
      setLoading(true);
      await authClient.signIn.magicLink({
        email,
        "callbackURL": "/dashboard",
      });
      Alert.alert("Check your email", "We sent you a magic link to sign in.");
      setShowEmailInput(false);
      animateSuccess();
    } catch {
      Alert.alert("Error", "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { perspective: CARD_PERSPECTIVE },
      { rotateY: `${cardRotation.value}deg` },
      { translateY: cardTranslateY.value },
    ],
  }));

  return (
    <View className="flex-1 items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-950">
      <View className="absolute inset-0 opacity-5 pointer-events-none">
        <View className="absolute top-10 left-10 w-4 h-4 rounded-full bg-black dark:bg-white" />
        <View className="absolute top-10 right-10 w-4 h-4 rounded-full bg-black dark:bg-white" />
        <View className="absolute bottom-10 left-10 w-4 h-4 rounded-full bg-black dark:bg-white" />
        <View className="absolute bottom-10 right-10 w-4 h-4 rounded-full bg-black dark:bg-white" />
      </View>

      <Animated.View
        style={animatedStyle}
        className={`w-full max-w-[${MAX_CARD_WIDTH}px] border-2 border-black bg-white shadow-[8px_8px_0px_#000] dark:border-white dark:bg-zinc-900 dark:shadow-[8px_8px_0px_#fff]`}
      >
        <View className="absolute -top-6 left-1/2 w-12 h-4 items-center justify-center -translate-x-1/2 rounded-full border-2 border-black bg-zinc-200 dark:border-white dark:bg-zinc-800">
          <View className="w-8 h-1 rounded-full bg-black opacity-20 dark:bg-white" />
        </View>

        <View className="p-6 border-b-2 border-black bg-zinc-50 dark:border-white dark:bg-zinc-800/50">
          <View className="flex-row items-start justify-between mb-4">
            <Ionicons
              name="qr-code-outline"
              size={42}
              color="black"
              className="dark:text-white"
            />
            <View className="items-end">
              <Text className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                ACCESS_LEVEL
              </Text>
              <Text className="px-2 py-0.5 mt-1 text-sm font-bold font-mono text-black bg-zinc-200 dark:bg-zinc-700 dark:text-white">
                GUEST
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-black tracking-tighter font-mono text-black dark:text-white">
            PRINTY_ID
          </Text>
          <Text className="mt-1 text-xs tracking-widest font-mono uppercase text-zinc-500 dark:text-zinc-400">
            Secure Authentication Terminal
          </Text>
        </View>

        <View className="p-6">
          <Text className="mb-4 text-xs font-bold font-mono uppercase text-black dark:text-white">
            {"// Select Identity Provider"}
          </Text>

          <AuthButton
            variant="primary"
            label="Continue with GitHub"
            icon="logo-github"
            onPress={() => handleSocialLogin("github")}
            loading={loading}
          />

          <AuthButton
            variant="secondary"
            label="Continue with Google"
            icon="logo-google"
            onPress={() => handleSocialLogin("google")}
            loading={loading}
          />

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-zinc-300 dark:bg-zinc-700" />
            <Text className="mx-3 text-xs font-mono text-zinc-400 dark:text-zinc-500">
              — OR —
            </Text>
            <View className="flex-1 h-[1px] bg-zinc-300 dark:bg-zinc-700" />
          </View>

          {showEmailInput ? (
            <Animated.View className="space-y-3">
              <View>
                <Text className="mb-1 text-[10px] font-mono text-black dark:text-white">
                  USER_EMAIL
                </Text>
                <TextInput
                  className="w-full h-12 px-3 border-2 border-black bg-zinc-50 font-mono text-black focus:bg-white dark:border-white dark:bg-zinc-800 dark:text-white dark:focus:bg-black"
                  placeholder="Enter email address..."
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <Pressable
                onPress={handleEmailLogin}
                disabled={loading}
                className="items-center justify-center h-12 border-2 border-black bg-black active:opacity-80 dark:border-white dark:bg-white"
              >
                <Text className="font-bold font-mono tracking-wider text-white uppercase dark:text-black">
                  {loading ? "SENDING..." : "Request Access Link"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowEmailInput(false)}
                className="items-center py-2"
              >
                <Text className="text-xs font-mono text-zinc-500 underline">
                  Cancel
                </Text>
              </Pressable>
            </Animated.View>
          ) : (
            <AuthButton
              variant="outline"
              label="Continue with Email"
              icon="mail-outline"
              onPress={() => setShowEmailInput(true)}
              loading={loading}
            />
          )}
        </View>

        <View className="p-4 items-center border-t-2 border-black bg-zinc-100 dark:border-white dark:bg-zinc-900/50">
          <View className="flex-row gap-4">
            <Text className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              TERMS_V2.1
            </Text>
            <Text className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              PRIVACY_PROTOCOL
            </Text>
          </View>
          <View className="w-full h-1 mt-3 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            <View className="w-1/3 h-full bg-black opacity-20 dark:bg-white" />
          </View>
        </View>
      </Animated.View>

      <Text className="absolute bottom-8 text-center text-[10px] font-mono text-zinc-400 opacity-50">
        SYSTEM STATUS: ONLINE{"\n"}
        ENCRYPTION: AES-256
      </Text>
    </View>
  );
}
