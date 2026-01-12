import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from "react-native";

function enableAndroidLayoutAnimation() {
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

enableAndroidLayoutAnimation();

const ERROR_STATUS_THRESHOLD = 400;
const MIN_GRAPH_HEIGHT_PCT = 10;
const FULL_PERCENTAGE = 100;

const WEBHOOKS_DATA = [
  {
    id: "wh_123456789",
    title: "GitHub PRs",
    url: "https://api.printy.app/wh/gh_pr_8x92...",
    status: "active",
    secret: "whsec_5f8a9d...",
    events: ["push", "pull_request"],
    deliveries: [
      { id: "d1", status: 200, count: 12 },
      { id: "d2", status: 200, count: 8 },
      { id: "d3", status: 400, count: 1 },
      { id: "d4", status: 200, count: 15 },
      { id: "d5", status: 200, count: 5 },
      { id: "d6", status: 500, count: 2 },
      { id: "d7", status: 200, count: 20 },
      { id: "d8", status: 200, count: 18 },
      { id: "d9", status: 200, count: 10 },
      { id: "d10", status: 200, count: 4 },
    ],
  },
  {
    id: "wh_987654321",
    title: "Stripe Payments",
    url: "https://api.printy.app/wh/str_pay_7z11...",
    status: "active",
    secret: "whsec_9b2c3d...",
    events: ["charge.succeeded", "charge.failed"],
    deliveries: [
      { id: "d11", status: 200, count: 45 },
      { id: "d12", status: 200, count: 32 },
      { id: "d13", status: 200, count: 28 },
      { id: "d14", status: 200, count: 40 },
      { id: "d15", status: 200, count: 35 },
      { id: "d16", status: 200, count: 38 },
      { id: "d17", status: 200, count: 42 },
      { id: "d18", status: 200, count: 30 },
      { id: "d19", status: 200, count: 25 },
      { id: "d20", status: 200, count: 20 },
    ],
  },
  {
    id: "wh_456123789",
    title: "Linear Issues",
    url: "https://api.printy.app/wh/lin_iss_3k44...",
    status: "inactive",
    secret: "whsec_1a2b3c...",
    events: ["issue.created", "issue.updated"],
    deliveries: [
      { id: "d21", status: 200, count: 0 },
      { id: "d22", status: 200, count: 0 },
      { id: "d23", status: 200, count: 0 },
      { id: "d24", status: 200, count: 0 },
      { id: "d25", status: 200, count: 0 },
      { id: "d26", status: 200, count: 0 },
      { id: "d27", status: 200, count: 0 },
      { id: "d28", status: 200, count: 0 },
      { id: "d29", status: 200, count: 0 },
      { id: "d30", status: 200, count: 0 },
    ],
  },
];

const MiniGraph = ({
  data,
}: {
  data: { id: string; status: number; count: number }[];
}) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 2,
        height: 32,
        marginTop: 8,
      }}
    >
      {data.map((d) => {
        const heightPct = (d.count / max) * FULL_PERCENTAGE;
        const isError = d.status >= ERROR_STATUS_THRESHOLD;
        return (
          <View
            key={d.id}
            className={`flex-1 rounded-sm ${
              isError ? "bg-red-500/80" : "bg-emerald-500/80"
            }`}
            style={{
              height: `${Math.max(heightPct, MIN_GRAPH_HEIGHT_PCT)}%`,
            }}
          />
        );
      })}
    </View>
  );
};

const WebhookItem = ({
  item,
  expanded,
  onPress,
}: {
  item: (typeof WEBHOOKS_DATA)[0];
  expanded: boolean;
  onPress: () => void;
}) => (
  <View className="mb-3 overflow-hidden rounded-xl border border-border bg-card">
    <Pressable
      onPress={onPress}
      className={`p-4 ${expanded ? "bg-muted/30" : ""}`}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              backgroundColor: item.status === "active" ? "#10b981" : "#a1a1aa",
            }}
          />
          <Text className="text-base font-medium text-foreground">
            {item.title}
          </Text>
        </View>
        <View
          className="bg-muted"
          style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}
        >
          <Text className="text-xs font-medium uppercase text-muted-foreground">
            {item.status}
          </Text>
        </View>
      </View>

      <View
        className="rounded-md border border-border/50 bg-background/50"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
        }}
      >
        <Text
          className="text-xs font-mono text-muted-foreground"
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {item.url}
        </Text>
        <Pressable
          className="p-1 active:opacity-50"
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <Ionicons name="copy-outline" size={14} color="#a1a1aa" />
        </Pressable>
      </View>
    </Pressable>

    {expanded && (
      <View className="border-t border-border bg-muted/10 p-4 pt-0">
        <View style={{ marginTop: 16 }}>
          <Text
            className="text-xs font-semibold text-muted-foreground"
            style={{ marginBottom: 8 }}
          >
            RECENT DELIVERIES (24H)
          </Text>
          <MiniGraph data={item.deliveries} />
        </View>

        <View style={{ marginTop: 16, flexDirection: "row", gap: 16 }}>
          <View className="flex-1">
            <Text
              className="text-xs font-semibold text-muted-foreground"
              style={{ marginBottom: 4 }}
            >
              EVENTS
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {item.events.map((evt) => (
                <View
                  key={evt}
                  className="rounded border border-border bg-background"
                  style={{ paddingHorizontal: 6, paddingVertical: 2 }}
                >
                  <Text className="text-[10px] font-mono text-foreground">
                    {evt}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text
            className="text-xs font-semibold text-muted-foreground"
            style={{ marginBottom: 4 }}
          >
            SIGNING SECRET
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text className="text-xs font-mono text-foreground">
              {item.secret}
            </Text>
            <Ionicons name="eye-off-outline" size={12} color="#71717a" />
          </View>
        </View>

        <Pressable
          className="rounded-lg border border-red-500/20 bg-red-500/5 active:bg-red-500/10"
          style={{
            marginTop: 24,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="trash-outline"
            size={14}
            color="#ef4444"
            style={{ marginRight: 6 }}
          />
          <Text className="text-xs font-medium text-red-500">
            Delete Webhook
          </Text>
        </Pressable>
      </View>
    )}
  </View>
);

export default function WebhooksScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Webhooks",
          headerLargeTitle: true,
          headerBlurEffect: "prominent",
          headerTransparent: true,
          headerRight: () => (
            <Pressable
              className="rounded-full bg-primary active:opacity-50"
              style={{
                height: 32,
                width: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add" size={20} color="white" />
            </Pressable>
          ),
        }}
      />
      <View className="flex-1 bg-background">
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingTop: 160 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          {WEBHOOKS_DATA.map((item) => (
            <WebhookItem
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onPress={() => toggleExpand(item.id)}
            />
          ))}

          <View
            className="rounded-xl border border-dashed border-border bg-muted/20"
            style={{
              marginTop: 16,
              padding: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-sm text-muted-foreground">
              Webhooks deliver events to your backend in real-time.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
