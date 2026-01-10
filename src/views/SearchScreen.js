import { SafeAreaView } from "react-native-safe-area-context"
import { Text, TextInput, View, Pressable, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useEffect, useState } from "react"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import { Ionicons } from '@expo/vector-icons';
import { useSearch } from "../viewmodels/useSearch"
import { useNavigation } from "@react-navigation/native"
import { getRandomWord, getExploreWords } from "../database/randomWords"
import { formatTerm } from "../utils/formatting"
import FloatingShapes from "../components/FloatingShapes"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

/* ---------------- HELPERS ---------------- */
const getDateString = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

/* ---------------- SCREEN ---------------- */
export default function SearchScreen() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [wordOfDay, setWordOfDay] = useState(null)
  const [exploreWords, setExploreWords] = useState([])
  const { words, error, searchFn } = useSearch();
  const navigation = useNavigation();

  /* Fetch Word of the Day and Explore Words */
  useEffect(() => {
    async function loadData() {
      const wod = await getRandomWord();
      if (wod) setWordOfDay(wod);

      const explore = await getExploreWords(8);
      setExploreWords(explore);
    }
    loadData();
  }, [])

  /* Search Effect */
  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      await searchFn(query);
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const onClear = () => {
    setQuery("")
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <LinearGradient colors={["#F8F9FC", "#F0F2F8", "#EEF1F7"]} style={{ flex: 1 }}>
      <FloatingShapes />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#6366F1', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>{getDateString()}</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1E293B' }}>{getGreeting()}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Quiz")}
                style={{ width: 44, height: 44, backgroundColor: 'white', borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}
              >
                <Ionicons name="school-outline" size={22} color="#4F46E5" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("History")}
                style={{ width: 44, height: 44, backgroundColor: 'white', borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}
              >
                <Ionicons name="time-outline" size={22} color="#4F46E5" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Favorites")}
                style={{ width: 44, height: 44, backgroundColor: 'white', borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}
              >
                <Ionicons name="heart-outline" size={22} color="#EC4899" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={{ marginBottom: 24, paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
                <Ionicons name="search" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Search for a word..."
                    placeholderTextColor="#94A3B8"
                    style={{ fontSize: 16, color: '#1E293B' }}
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {query.length > 0 && (
                  <Pressable
                    onPress={onClear}
                    style={{ marginLeft: 8, backgroundColor: '#F1F5F9', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ionicons name="close" size={14} color="#64748B" />
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          {/* Content Section - Scrollable */}
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Word of the Day */}
            {!query && wordOfDay && (
              <View style={{ marginBottom: 32 }}>
                <Pressable onPress={() => navigation.navigate("WordScreen", { word: wordOfDay })}>
                  <LinearGradient
                    colors={["#4F46E5", "#7C3AED"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 28,
                      padding: 24,
                      shadowColor: "#4F46E5",
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.3,
                      shadowRadius: 20,
                      elevation: 10,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 6, height: 6, backgroundColor: 'white', borderRadius: 3, marginRight: 8, opacity: 0.8 }} />
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: 2 }}>Word of the Day</Text>
                      </View>
                      <Ionicons name="sparkles" size={16} color="#FDE68A" />
                    </View>

                    <Text style={{ fontSize: 32, fontWeight: '800', color: 'white', marginBottom: 12 }}>{formatTerm(wordOfDay.term)}</Text>

                    <Text style={{ fontSize: 16, color: '#C7D2FE', lineHeight: 24 }} numberOfLines={3}>{wordOfDay.definition}</Text>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold', marginRight: 8 }}>Learn more</Text>
                      <Ionicons name="arrow-forward" size={16} color="white" />
                    </View>
                  </LinearGradient>
                </Pressable>
              </View>
            )}

            {/* Search Results */}
            {query.length > 0 && (
              <View style={{ flex: 1, paddingBottom: 32 }}>
                {loading ? (
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
                    <Text style={{ color: '#94A3B8', marginTop: 16, fontSize: 14 }}>Searching dictionary...</Text>
                  </View>
                ) : error ? (
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
                    <View style={{ width: 80, height: 80, backgroundColor: '#F1F5F9', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <Ionicons name="search-outline" size={32} color="#94A3B8" />
                    </View>
                    <Text style={{ color: '#1E293B', fontWeight: 'bold', fontSize: 18, marginBottom: 4, textAlign: 'center' }}>No results found</Text>
                    <Text style={{ color: '#64748B', fontSize: 14, textAlign: 'center' }}>We couldn't find "{query}"</Text>
                  </View>
                ) : (
                  <>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
                      {words.length} Matches Found
                    </Text>
                    {words.map((item) => (
                      <Pressable
                        key={item.wordId}
                        style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }}
                        onPress={() => {
                          Haptics.selectionAsync()
                          navigation.navigate("WordScreen", { word: item })
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 }}>{formatTerm(item.term)}</Text>
                            <Text style={{ fontSize: 14, color: '#64748B', fontStyle: 'italic' }}>{partOfSpeechLegend[item.partOfSpeech]}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                        </View>
                      </Pressable>
                    ))}
                  </>
                )}
              </View>
            )}

            {/* Explore Collections */}
            {!query && !loading && (
              <View style={{ marginTop: 8, paddingBottom: 40 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Explore Collections</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {exploreWords.map((item, index) => {
                    const colorSchemes = [
                      { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
                      { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
                      { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
                      { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' },
                      { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
                    ];
                    const scheme = colorSchemes[index % colorSchemes.length];

                    return (
                      <Pressable
                        key={item.wordId}
                        onPress={() => navigation.navigate("WordScreen", { word: item })}
                        style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 9999, borderWidth: 1, borderColor: scheme.border, backgroundColor: scheme.bg }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: scheme.text }}>{formatTerm(item.term)}</Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}
