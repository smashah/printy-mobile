/* eslint-disable tailwindcss/classnames-order */
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LogEntry = {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
};

const PULSE_DURATION = 2000;
const CONNECTION_DURATION = 1500;
const DOT_DELAY = 750;
const LOG_INTERVAL = 3000;
const JOB_INTERVAL = 15_000;
const PRINT_DELAY = 1000;
const MAX_LOGS = 10;
const FADE_IN_DURATION = 400;

const PULSE_SCALE_MAX = 1.5;
const PULSE_SCALE_DEFAULT = 1;
const PULSE_OPACITY_MIN = 0;
const PULSE_OPACITY_DEFAULT = 0.6;
const RING_SCALE = 1.2;
const DOT_START = 0;
const DOT_END = 1;
const DOT_PERCENT = 100;
const OPACITY_HIDDEN = 0;
const OPACITY_VISIBLE = 1;
const DOT_FADE_THRESHOLD_LOW = 0.1;
const DOT_FADE_THRESHOLD_HIGH = 0.9;
const HEADER_OFFSET = 10;
const SCROLL_PADDING = 20;

const getLogTextColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'error':
 return 'text-red-400';
    case 'success':
 return 'text-emerald-400';
    default:
 return 'text-green-500/80';
  }
};

const BridgeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isDimmed, setIsDimmed] = useState(false);
  const [keepAwake, setKeepAwake] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const pulseScale = useSharedValue(PULSE_SCALE_DEFAULT);
  const pulseOpacity = useSharedValue(PULSE_OPACITY_DEFAULT);
  const connectionDot1 = useSharedValue(DOT_START);
  const connectionDot2 = useSharedValue(DOT_START);

  useEffect(() => {
    if (isActive) {
      pulseScale.value = withRepeat(
        withTiming(PULSE_SCALE_MAX, { duration: PULSE_DURATION, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withTiming(PULSE_OPACITY_MIN, { duration: PULSE_DURATION, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );

      connectionDot1.value = withRepeat(
        withTiming(DOT_END, { duration: CONNECTION_DURATION, easing: Easing.linear }),
        -1,
        false
      );
      
      setTimeout(() => {
        connectionDot2.value = withRepeat(
          withTiming(DOT_END, { duration: CONNECTION_DURATION, easing: Easing.linear }),
          -1,
          false
        );
      }, DOT_DELAY);
    } else {
        pulseScale.value = PULSE_SCALE_DEFAULT;
        pulseOpacity.value = OPACITY_HIDDEN;
    }
  }, [isActive, pulseScale, pulseOpacity, connectionDot1, connectionDot2]);

  useEffect(() => {
    if (!isActive) {
 return;
}

    const messages = [
      "Heartbeat acknowledged",
      "Checking print queue...",
      "Connection stable (34ms)",
      "Syncing templates...",
      "Waiting for jobs...",
      "Memory usage: 14MB",
    ];

    const addLog = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false });
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      setLogs(prev => {
        const newLogs = [...prev, {
          id: Date.now().toString(),
          timestamp: timeString,
          message: randomMsg,
          type: 'info'
        }];
        return newLogs.slice(-MAX_LOGS);
      });
    };

    setLogs([{
      id: 'init',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message: "Bridge service initialized",
      type: 'success'
    }]);

    const interval = setInterval(addLog, LOG_INTERVAL);
    
    const jobInterval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false });
      
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: timeString,
        message: "⬇️ Job received from GitHub",
        type: 'success'
      }]);
      
      setTimeout(() => {
        setLogs(prev => [...prev, {
            id: `${Date.now().toString()}p`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message: "🖨️ Printing...",
            type: 'info'
        }]);
      }, PRINT_DELAY);

    }, JOB_INTERVAL);

    return () => {
      clearInterval(interval);
      clearInterval(jobInterval);
    };
  }, [isActive]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const dot1Style = useAnimatedStyle(() => ({
    left: `${connectionDot1.value * DOT_PERCENT}%`,
    opacity: connectionDot1.value < DOT_FADE_THRESHOLD_LOW || connectionDot1.value > DOT_FADE_THRESHOLD_HIGH ? OPACITY_HIDDEN : OPACITY_VISIBLE,
  }));
  
  const dot2Style = useAnimatedStyle(() => ({
    left: `${connectionDot2.value * DOT_PERCENT}%`,
    opacity: connectionDot2.value < DOT_FADE_THRESHOLD_LOW || connectionDot2.value > DOT_FADE_THRESHOLD_HIGH ? OPACITY_HIDDEN : OPACITY_VISIBLE,
  }));

  const handleTerminate = () => {
    setIsActive(false);
    setLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message: "Bridge service terminated by user",
      type: 'error'
    }]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      <View className={`bg-neutral-950 duration-500 flex-1 opacity-100 transition-opacity ${isDimmed ? 'opacity-40' : 'opacity-100'}`}>
        <View 
          className="border-b border-neutral-800 flex-row items-center justify-between px-6 py-4"
          style={{ paddingTop: insets.top + HEADER_OFFSET }}
        >
          <Pressable onPress={() => router.back()} className="active:bg-neutral-800 p-2 rounded-full">
            <Feather name="arrow-left" size={24} color="#A3A3A3" />
          </Pressable>
          <Text className="font-medium text-neutral-400 text-xs tracking-widest uppercase">Mission Control</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + SCROLL_PADDING }}>
          
          <View className="items-center justify-center py-12 relative">
            {isActive && (
              <Animated.View 
                className="absolute bg-emerald-500/20 h-64 rounded-full w-64"
                style={pulseStyle}
              />
            )}
            {isActive && (
              <Animated.View 
                className="absolute bg-emerald-500/10 h-48 rounded-full w-48"
                style={[{ transform: [{ scale: useSharedValue(RING_SCALE).value }] }]}
              />
            )}
            
            <View className="bg-neutral-900 border-2 border-neutral-800 h-32 items-center justify-center rounded-full shadow-2xl shadow-emerald-900/20 w-32 z-10">
              <View className={`h-4 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] w-4 ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </View>

            <Text className="font-bold mt-8 text-3xl text-white tracking-tight">
              {isActive ? 'BRIDGE ACTIVE' : 'BRIDGE OFFLINE'}
            </Text>
            <Text className="mt-2 text-neutral-500 text-sm">
              {isActive ? 'Listening for incoming jobs...' : 'Service stopped'}
            </Text>
          </View>

          <View className="px-6 py-8">
            <View className="bg-neutral-900/50 border border-neutral-800/50 p-6 rounded-2xl">
              <View className="flex-row items-center justify-between px-4 relative">
                
                <View className="absolute bg-neutral-800 h-[2px] left-8 right-8 top-1/2 -z-10" />
                
                {isActive && (
                    <View className="absolute h-[2px] left-8 overflow-hidden right-8 top-1/2 -z-10">
                        <Animated.View className="absolute bg-emerald-500 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] top-[-3px] w-2" style={dot1Style} />
                        <Animated.View className="absolute bg-emerald-400/70 h-2 rounded-full top-[-3px] w-2" style={dot2Style} />
                    </View>
                )}

                <View className="bg-neutral-900 items-center px-2 space-y-2">
                  <View className="bg-neutral-800 border border-neutral-700 h-12 items-center justify-center rounded-full w-12">
                    <Feather name="cloud" size={20} color="#E5E5E5" />
                  </View>
                  <Text className="font-medium text-[10px] text-neutral-500 tracking-wider uppercase">Cloud</Text>
                </View>

                <View className="bg-neutral-900 items-center px-2 space-y-2">
                  <View className="bg-neutral-800 border border-neutral-700 h-12 items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] w-12">
                    <Feather name="smartphone" size={20} color="#E5E5E5" />
                  </View>
                  <Text className="font-bold text-[10px] text-emerald-500 tracking-wider uppercase">Bridge</Text>
                </View>

                <View className="bg-neutral-900 items-center px-2 space-y-2">
                  <View className="bg-neutral-800 border border-neutral-700 h-12 items-center justify-center rounded-full w-12">
                    <Feather name="printer" size={20} color="#E5E5E5" />
                  </View>
                  <Text className="font-medium text-[10px] text-neutral-500 tracking-wider uppercase">Printer</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mb-8 px-6">
            <Text className="font-medium mb-3 ml-1 text-neutral-500 text-xs tracking-wider uppercase">System Logs</Text>
            <View className="bg-black border border-neutral-800 h-48 overflow-hidden p-4 rounded-xl">
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
                {logs.map((log) => (
                  <Animated.View 
                    entering={FadeInDown.duration(FADE_IN_DURATION)} 
                    key={log.id} 
                    className="flex-row items-start mb-1.5 space-x-2"
                  >
                    <Text className="font-mono pt-0.5 text-[10px] text-neutral-600">{log.timestamp}</Text>
                    <Text className={`flex-1 font-mono text-xs ${getLogTextColor(log.type)}`}>
                      {log.message}
                    </Text>
                  </Animated.View>
                ))}
                {logs.length === 0 && (
                    <Text className="font-mono italic text-neutral-700 text-xs">Waiting for events...</Text>
                )}
              </ScrollView>
            </View>
          </View>

          <View className="px-6 space-y-3">
            <View className="bg-neutral-900/50 border border-neutral-800/50 flex-row items-center justify-between p-4 rounded-xl">
              <View className="flex-row items-center space-x-3">
                <View className="bg-neutral-800 h-8 items-center justify-center rounded-full w-8">
                  <Feather name="moon" size={16} color="#A3A3A3" />
                </View>
                <View>
                  <Text className="font-medium text-neutral-200 text-sm">Dim Screen</Text>
                  <Text className="text-neutral-500 text-xs">Save battery life</Text>
                </View>
              </View>
              <Switch 
                value={isDimmed}
                onValueChange={setIsDimmed}
                trackColor={{ false: '#262626', true: '#10B981' }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            <View className="bg-neutral-900/50 border border-neutral-800/50 flex-row items-center justify-between p-4 rounded-xl">
              <View className="flex-row items-center space-x-3">
                <View className="bg-neutral-800 h-8 items-center justify-center rounded-full w-8">
                  <Feather name="sun" size={16} color="#A3A3A3" />
                </View>
                <View>
                  <Text className="font-medium text-neutral-200 text-sm">Keep Awake</Text>
                  <Text className="text-neutral-500 text-xs">Prevent sleep mode</Text>
                </View>
              </View>
              <Switch 
                value={keepAwake}
                onValueChange={setKeepAwake}
                trackColor={{ false: '#262626', true: '#10B981' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          <View className="mb-4 mt-8 px-6">
            <Pressable 
              onPress={handleTerminate}
              disabled={!isActive}
              className={`flex-row items-center justify-center py-4 rounded-xl space-x-2 w-full ${
                isActive ? 'active:bg-red-500/20 bg-red-500/10 border border-red-500/50' : 'bg-neutral-800 border border-neutral-700 opacity-50'
              }`}
            >
              <Feather name="power" size={18} color={isActive ? '#EF4444' : '#737373'} />
              <Text className={`font-semibold ${isActive ? 'text-red-500' : 'text-neutral-500'}`}>
                {isActive ? 'TERMINATE BRIDGE' : 'TERMINATED'}
              </Text>
            </Pressable>
          </View>

        </ScrollView>
      </View>
    </>
  );
};

export default BridgeScreen;
