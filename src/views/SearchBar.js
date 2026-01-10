import React from "react";
import { View, TextInput, Text } from "react-native";
import { FadeInDown } from "react-native-reanimated";

import {
  AnimatedView,
  AnimatedFlatList,
  AnimatedPressable
} from "./safeAnimated";

import { useSearch } from "../viewmodels/useSearch";

export default function SearchBar({ navigation }) {
  const { words, error, searchFn } = useSearch();

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-4">

      {/* Search Input */}
      <View className="bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-sm mb-4">
        <TextInput
          placeholder="Search a word..."
          placeholderTextColor="#94a3b8"
          onChangeText={searchFn}
          className="text-base text-slate-900"
        />
      </View>

      {/* Error State */}
      {error && (
        <Text className="text-center text-red-500 mt-6">
          {error}
        </Text>
      )}

      {/* Results */}
      {!error && (
        <AnimatedView
          entering={FadeInDown.duration(400).springify()}
          className="flex-1"
        >
          <AnimatedFlatList
            data={words}
            keyExtractor={(item) => item.wordId.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item, index }) => (
              <AnimatedPressable
                entering={FadeInDown.delay(index * 60)}
                onPress={() =>
                  navigation.navigate("WordScreen", { word: item })
                }
                className="bg-white rounded-2xl p-4 mb-3 border border-slate-200 shadow-sm active:opacity-80"
              >
                <Text className="text-lg font-semibold text-slate-900">
                  {item.term}
                </Text>
              </AnimatedPressable>
            )}
          />
        </AnimatedView>
      )}

      {/* Empty State */}
      {!error && words.length === 0 && (
        <Text className="text-center text-slate-400 mt-10">
          Start typing to search…
        </Text>
      )}

    </View>
  );
}
