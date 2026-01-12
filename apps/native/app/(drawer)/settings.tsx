/* eslint-disable react-native/no-inline-styles */
import { signOut, useSession } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  Alert,
  Image,
  Pressable,
  SectionList,
  Text,
  View,
  type SectionListRenderItem,
} from "react-native";

const ICON_OPACITY = 0.8;
const DISABLED_OPACITY = 0.6;

type SettingItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isDestructive?: boolean;
  disabled?: boolean;
  value?: string;
  action?: () => void;
};

type SettingSection = {
  title: string;
  data: SettingItem[];
};

export default function SettingsScreen() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/auth/sign-in");
    } catch {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const settingsSections: SettingSection[] = [
    {
      title: "General",
      data: [
        { id: "printer", label: "Printer Settings", icon: "print-outline" },
      ],
    },
    {
      title: "Account",
      data: [
        { id: "subscription", label: "Subscription", icon: "card-outline" },
        { id: "restore", label: "Restore Purchases", icon: "refresh-outline" },
        {
          id: "signout",
          label: "Sign Out",
          icon: "log-out-outline",
          isDestructive: true,
          action: handleSignOut,
        },
      ],
    },
    {
      title: "Support",
      data: [
        { id: "help", label: "Help Center", icon: "help-circle-outline" },
        {
          id: "privacy",
          label: "Privacy Policy",
          icon: "shield-checkmark-outline",
        },
        {
          id: "terms",
          label: "Terms of Service",
          icon: "document-text-outline",
        },
      ],
    },
    {
      title: "App",
      data: [
        {
          id: "version",
          label: "Version",
          value: "1.0.0 (420)",
          icon: "information-circle-outline",
          disabled: true,
        },
      ],
    },
  ];

  const renderHeader = () => (
    <View
      style={{
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 32,
        backgroundColor: "hsl(var(--background))",
        borderBottomWidth: 1,
        borderColor: "hsl(var(--border))",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            height: 64,
            width: 64,
            overflow: "hidden",
            borderRadius: 9999,
            backgroundColor: "hsl(var(--muted))",
            borderWidth: 1,
            borderColor: "hsl(var(--border))",
          }}
        >
          {session?.user?.image ? (
            <Image
              source={{ uri: session.user.image }}
              style={{ width: "100%", height: "100%", opacity: 0.9 }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e4e4e7",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#71717a" }}>
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          )}
        </View>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "hsl(var(--foreground))",
                letterSpacing: -0.5,
              }}
            >
              {session?.user?.name || "Guest User"}
            </Text>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                backgroundColor: "hsla(var(--primary), 0.1)",
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "hsla(var(--primary), 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "hsl(var(--primary))",
                }}
              >
                FREE
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
            {session?.user?.email || "Not signed in"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: SettingSection;
  }) => (
    <View
      style={{
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: "hsl(var(--muted-foreground))",
        }}
      >
        {title}
      </Text>
    </View>
  );

  const renderItem: SectionListRenderItem<SettingItem> = ({ item }) => (
    <Pressable
      disabled={item.disabled}
      onPress={item.action}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: pressed
          ? "hsl(var(--muted))"
          : "hsl(var(--background))",
        opacity: item.disabled ? DISABLED_OPACITY : 1,
      })}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={item.isDestructive ? "#ef4444" : "hsl(var(--foreground))"}
        style={{ marginRight: 12, opacity: ICON_OPACITY }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 4,
          borderBottomWidth: 1,
          borderColor: "rgba(var(--border), 0.4)",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: item.isDestructive
              ? "hsl(var(--destructive))"
              : "hsl(var(--foreground))",
          }}
        >
          {item.label}
        </Text>
        {item.value ? (
          <Text style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
            {item.value}
          </Text>
        ) : null}
        {item.disabled || item.value ? null : (
          <Ionicons
            name="chevron-forward"
            size={16}
            color="hsl(var(--muted-foreground))"
          />
        )}
      </View>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <View style={{ flex: 1, backgroundColor: "hsl(var(--background))" }}>
        <SectionList
          sections={settingsSections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 40 }}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}
