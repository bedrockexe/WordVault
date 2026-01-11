/** @jsxImportSource react */
import React from "react";
import Animated from "react-native-reanimated";
import { Pressable, FlatList } from "react-native";

/* ---------- Animated exports ---------- */
// Directly export standard Reanimated components
export const AnimatedView = Animated.View;
export const AnimatedText = Animated.Text;
export const AnimatedFlatList = Animated.FlatList;
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

