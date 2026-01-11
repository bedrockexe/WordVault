import { useEffect } from "react";
import { Text, View } from "react-native";
import {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from "react-native-reanimated";

import { AnimatedText, AnimatedView } from "./safeAnimated";

export default function LoadingScreen() {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { friction: 6 });

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center bg-slate-50">

      <AnimatedView style={logoStyle} className="items-center">
        <Text className="text-4xl font-bold text-emerald-600">
          WordVault
        </Text>

        <AnimatedText
          style={subtitleStyle}
          className="mt-3 text-slate-500 text-base"
        >
          Loading offline dictionary…
        </AnimatedText>
      </AnimatedView>

    </View>
  );
}
