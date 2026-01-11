import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useGetWordDetails } from "../viewmodels/useGetWordDetails"
import { useFavorites } from "../viewmodels/useFavorites";
import { useHistory } from "../viewmodels/useHistory";
import { formatTerm } from "../utils/formatting";
import { searchWord } from "../database/searchWord";
import FloatingShapes from '../components/FloatingShapes';
import { LinearGradient } from 'expo-linear-gradient';

const partOfSpeechLegend = {
  n: "Noun",
  v: "Verb",
  a: "Adjective",
  s: "Adjective Satellite",
  r: "Adverb",
  t: "Article / Determiner",
  p: "Pronoun",
  c: "Conjunction",
  i: "Interjection",
  m: "Numeral",
  u: "Unknown / Other",
}

export default function WordScreen({ route }) {
  const navigation = useNavigation();
  const { examples, synonyms, antonyms } = useGetWordDetails(route.params.word.wordId)
  const { word } = route.params
  const { addToFavorites, removeFromFavorites, checkIsFavorite } = useFavorites();
  const { addToHistory } = useHistory();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    checkIsFavorite(word.wordId).then(setIsFav);
    addToHistory(word);
  }, [word.wordId]);

  const toggleFavorite = async () => {
    if (isFav) {
      await removeFromFavorites(word.wordId);
      setIsFav(false);
    } else {
      await addToFavorites(word);
      setIsFav(true);
    }
  };

  const playAudio = () => {
    Speech.speak(formatTerm(word.term), {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const handleLinkPress = async (term) => {
    // 1. Clean the term (case insensitive search usually handles case, but spaces matter)
    const cleanTerm = term.trim();

    // 2. Search DB
    const results = await searchWord(cleanTerm);

    // 3. Navigate or Alert
    if (results && results.length > 0) {
      navigation.push('WordScreen', { word: results[0] });
    } else {
      Alert.alert("Word not found", `"${cleanTerm}" is not in the dictionary.`);
    }
  };

  return (
    <LinearGradient colors={["#F8F9FC", "#F0F2F8", "#EEF1F7"]} style={{ flex: 1 }}>
      <FloatingShapes />
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={28} color="#1A1D23" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={28} color={isFav ? "#EF4444" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* Word Info Section */}
          <View style={styles.wordInfoSection}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <Text style={[styles.term, { flex: 1 }]}>{formatTerm(word.term)}</Text>
              <TouchableOpacity onPress={playAudio} style={styles.audioButton}>
                <Ionicons name="volume-high" size={24} color="#4F46E5" />
              </TouchableOpacity>
            </View>

            <View style={styles.posBadge}>
              <Text style={styles.posBadgeText}>
                {partOfSpeechLegend[word.partOfSpeech] ? partOfSpeechLegend[word.partOfSpeech] : word.partOfSpeech}
              </Text>
            </View>
          </View>

          {/* Definition Card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Definition</Text>
            <Text style={styles.definition}>{word.definition}</Text>
          </View>

          {/* Examples Card */}
          {examples?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Examples</Text>
              <View style={styles.listContainer}>
                {examples.map((ex, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listItemText}>{ex.example}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Synonyms Card */}
          {synonyms?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Synonyms</Text>
              <View style={styles.tagContainer}>
                {synonyms.map((s, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleLinkPress(s.synonym)}
                  >
                    <Text style={styles.tagText}>{formatTerm(s.synonym)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Antonyms Card */}
          {antonyms?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Antonyms</Text>
              <View style={styles.tagContainer}>
                {antonyms.map((a, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.tag, styles.antonymTag]}
                    onPress={() => handleLinkPress(a.antonym)}
                  >
                    <Text style={[styles.tagText, styles.antonymTagText]}>{formatTerm(a.antonym)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    zIndex: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  wordInfoSection: {
    marginBottom: 24,
    paddingBottom: 20,
  },
  term: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1A1D23",
    letterSpacing: -1,
    marginBottom: 16,
    lineHeight: 44,
  },
  posBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F3FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B8D9FF",
  },
  posBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E5A99",
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  definition: {
    fontSize: 18,
    lineHeight: 28,
    color: "#374151",
    fontWeight: "400",
  },
  listContainer: {
    gap: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
    marginTop: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: "#4B5563",
    fontWeight: "400",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tagText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4B5563",
  },
  antonymTag: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
  antonymTagText: {
    color: "#DC2626",
  },
  audioButton: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    marginBottom: 0,
  },
})
