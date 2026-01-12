/* eslint-disable react-native/no-inline-styles */
import {
  connectToDevice,
  requestPermissions,
  scanForPeripherals,
  stopScan,
} from "@/utils/ble";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import type { Device } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";

// biome-ignore lint/nursery/useSortedClasses: Sorting classes manually is error-prone in this environment
type ScannedDevice = {
  id: string;
  name: string | null;
  rssi: number | null;
  status: "available" | "connecting" | "connected";
  rawDevice: Device;
};

const BLINK_INTERVAL_MS = 500;
const SIGNAL_STRONG_THRESHOLD = -70;
const SIGNAL_MEDIUM_THRESHOLD = -80;
const SIGNAL_WEAK_THRESHOLD = -90;
const PAD_START_LENGTH = 4;
const LOG_SCROLL_DELAY_MS = 100;
const NAVIGATION_DELAY_MS = 1000;

export default function DeviceScanScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState<ScannedDevice[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, BLINK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const addLog = (msg: string) => {
      setLogs((prev) => [...prev, `> ${msg}`]);
      setTimeout(
        () => logContainerRef.current?.scrollToEnd(),
        LOG_SCROLL_DELAY_MS,
      );
    };

    const startScan = async () => {
      addLog("INIT_BLUETOOTH_ADAPTER...");
      const granted = await requestPermissions();
      if (!granted) {
        addLog("ERROR: PERMISSIONS_DENIED");
        setIsScanning(false);
        return;
      }

      addLog("SCANNING_FREQ_2.4GHZ...");
      scanForPeripherals((device) => {
        setDevices((prev) => {
          if (prev.find((d) => d.id === device.id)) {
            return prev;
          }
          addLog(`FOUND_DEV: ${device.name || "UNKNOWN"} [${device.rssi}dBm]`);
          return [
            ...prev,
            {
              id: device.id,
              name: device.name || device.localName || "UNKNOWN_DEVICE",
              rssi: device.rssi,
              status: "available",
              rawDevice: device,
            },
          ];
        });
      });
    };

    startScan();

    return () => {
      stopScan();
    };
  }, []);

  const handleConnect = async (scannedDevice: ScannedDevice) => {
    stopScan();
    setIsScanning(false);

    setDevices((prev) =>
      prev.map((d) =>
        d.id === scannedDevice.id ? { ...d, status: "connecting" } : d,
      ),
    );

    try {
      setLogs((prev) => [
        ...prev,
        `> INITIATING_LINK: ${scannedDevice.id}...`,
      ]);
      await connectToDevice(scannedDevice.id);
      setLogs((prev) => [...prev, "> CONNECTION_ESTABLISHED"]);

      setDevices((prev) =>
        prev.map((d) =>
          d.id === scannedDevice.id ? { ...d, status: "connected" } : d,
        ),
      );

      setTimeout(() => {
        router.back();
      }, NAVIGATION_DELAY_MS);
    } catch (error) {
      setLogs((prev) => [...prev, `> ERROR: ${error}`]);
      setDevices((prev) =>
        prev.map((d) =>
          d.id === scannedDevice.id ? { ...d, status: "available" } : d,
        ),
      );
    }
  };

  const getSignalBars = (rssi: number | null) => {
    if (!rssi) {
      return "|";
    }
    if (rssi > SIGNAL_STRONG_THRESHOLD) {
      return "||||";
    }
    if (rssi > SIGNAL_MEDIUM_THRESHOLD) {
      return "|||";
    }
    if (rssi > SIGNAL_WEAK_THRESHOLD) {
      return "||";
    }
    return "|";
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between p-4 pb-2 border-b border-[#33ff33]">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <MaterialIcons name="arrow-back-ios" size={18} color="#33ff33" />
          <Text className="ml-1 font-mono font-bold text-lg text-[#33ff33]">
            BACK
          </Text>
        </Pressable>
        <Text className="font-mono font-bold text-xl tracking-widest text-[#33ff33]">
          CONNECT_PRINTER
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 p-4">
        <View className="mb-6 p-4 bg-[#001a00] border border-[#33ff33]">
          <View className="flex-row justify-between">
            <Text className="font-mono text-xs text-[#33ff33] opacity-80">
              STATUS: {isScanning ? "SCANNING_ACTIVE" : "IDLE"}
            </Text>
            <Text className="font-mono text-xs text-[#33ff33] opacity-80">
              MODE: BLE_DISCOVERY
            </Text>
          </View>

          <View className="h-32 mt-4 overflow-hidden">
            <FlatList
              ref={logContainerRef}
              data={logs}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Text className="font-mono text-xs text-[#33ff33] opacity-60">
                  {item}
                </Text>
              )}
            />
            {isScanning && (
              <Text className="mt-1 font-mono text-xs text-[#33ff33]">
                _{cursorVisible ? "█" : " "}
              </Text>
            )}
          </View>
        </View>

        <Text className="mb-2 font-mono text-sm text-[#33ff33] opacity-50">
          DISCOVERED_TARGETS ({devices.length})
        </Text>

        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between mb-3 p-3 bg-black border border-[#33ff33]">
              <View>
                <Text className="font-mono font-bold text-lg text-[#33ff33]">
                  {item.name}
                </Text>
                <Text className="font-mono text-xs text-[#33ff33] opacity-70">
                  ID: {item.id.padStart(PAD_START_LENGTH, "0")} | RSSI:{" "}
                  {item.rssi} [{getSignalBars(item.rssi)}]
                </Text>
              </View>

              {item.status === "available" && (
                <Pressable
                  onPress={() => handleConnect(item)}
                  className="px-3 py-1 bg-[#33ff33] active:opacity-80"
                >
                  <Text className="font-mono font-bold text-sm text-black">
                    CONNECT
                  </Text>
                </Pressable>
              )}

              {item.status === "connecting" && (
                <Text className="animate-pulse font-mono font-bold text-sm text-[#33ff33]">
                  PAIRING...
                </Text>
              )}

              {item.status === "connected" && (
                <View className="flex-row items-center">
                  <Text className="mr-2 font-mono font-bold text-sm text-[#33ff33]">
                    LINKED
                  </Text>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#33ff33"
                  />
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            isScanning ? null : (
              <View className="items-center py-10">
                <Text className="font-mono text-[#33ff33] opacity-50">
                  NO_SIGNALS_DETECTED
                </Text>
              </View>
            )
          }
        />
      </View>

      <View className="p-4 pb-8 bg-black border-t border-[#33ff33]">
        <Pressable className="items-center">
          <Text className="font-mono underline text-sm text-[#33ff33] opacity-70">
            [ RUN_TROUBLESHOOT_SEQ ]
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
