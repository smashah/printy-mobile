import { View, Text, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const shadowOffset = 4;

const colors = {
  paper: "#F5F5F0",
  ink: "#111111",
  graphite: "#4A4A4A",
  electricBlue: "#2952FF",
  white: "#FFFFFF",
};

const fonts = {
  mono: Platform.OS === "ios" ? "Menlo" : "monospace",
  sans: Platform.OS === "ios" ? "System" : "sans-serif",
};

const animation = {
  delayLogo: 100,
  delayHero: 300,
  delayTitle: 500,
  delaySubtitle: 600,
  delayBody: 700,
  delayButton: 900,
  delayLink: 1100,
  durationHero: 800,
  durationButton: 50,
  buttonPressDepth: 4,
  iconSize: 120,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const router = useRouter();
  const buttonPressed = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          buttonPressed.value ? animation.buttonPressDepth : 0,
          { duration: animation.durationButton },
        ),
      },
    ],
    boxShadow: buttonPressed.value
      ? `0px 0px 0px ${colors.ink}`
      : `${shadowOffset}px ${shadowOffset}px 0px ${colors.ink}`,
    elevation: buttonPressed.value ? 0 : shadowOffset,
  }));

  const handlePressIn = () => {
    buttonPressed.value = 1;
  };

  const handlePressOut = () => {
    buttonPressed.value = 0;
  };

  const handlePress = () => {
    router.push("/(drawer)");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F0]">
      <View className="flex-1 justify-between px-6 py-12">
        <Animated.View
          entering={FadeInDown.delay(animation.delayLogo).springify()}
          className="items-center"
        >
          <Text
            style={{ fontFamily: fonts.mono, color: colors.ink }}
            className="font-extrabold text-2xl tracking-widest"
          >
            PRINTY
          </Text>
        </Animated.View>

        <View className="w-full items-center space-y-8">
          <Animated.View
            entering={FadeIn.delay(animation.delayHero).duration(
              animation.durationHero,
            )}
            className="mb-4 items-center justify-center"
          >
            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={animation.iconSize}
              color={colors.ink}
            />
          </Animated.View>

          <View className="items-center space-y-3">
            <Animated.Text
              entering={FadeInDown.delay(animation.delayTitle).springify()}
              style={{
                fontFamily: fonts.mono,
                color: colors.ink,
                fontSize: 24,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                textAlign: "center",
              }}
            >
              PHYSICAL ARTIFACTS
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(animation.delaySubtitle).springify()}
              style={{
                fontFamily: fonts.sans,
                color: colors.graphite,
                fontSize: 18,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              For the Digital Age.
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(animation.delayBody).springify()}
              style={{ fontFamily: fonts.sans, color: colors.graphite }}
              className="mt-2 px-4 text-center text-base"
            >
              Connect your thermal printer and start making.
            </Animated.Text>
          </View>
        </View>

        <View className="w-full items-center space-y-6">
          <AnimatedPressable
            entering={FadeInDown.delay(animation.delayButton).springify()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[
              {
                backgroundColor: colors.electricBlue,
                borderColor: colors.ink,
                borderWidth: 2,
                width: "100%",
                paddingVertical: 16,
                alignItems: "center",
                shadowColor: colors.ink,
                shadowOffset: { width: shadowOffset, height: shadowOffset },
                shadowOpacity: 1,
                shadowRadius: 0,
              },
              buttonStyle,
            ]}
          >
            <Text
              style={{ fontFamily: fonts.sans, color: colors.white }}
              className="font-bold text-lg uppercase tracking-wide"
            >
              Start Printing
            </Text>
          </AnimatedPressable>

          <Animated.View
            entering={FadeInDown.delay(animation.delayLink).springify()}
          >
            <Link href="/(drawer)" asChild>
              <Pressable>
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    color: colors.electricBlue,
                    fontSize: 16,
                    fontWeight: "600",
                    textDecorationLine: "underline",
                  }}
                >
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}
