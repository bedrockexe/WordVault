import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../viewmodels/useFavorites';
import { getRandomWord, getExploreWords } from '../database/randomWords';
import { formatTerm } from '../utils/formatting';
import { saveQuizResult } from '../database/quizHistory';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function QuizGameScreen() {
    const navigation = useNavigation();
    const { favorites } = useFavorites();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizComplete, setQuizComplete] = useState(false);
    const [answeredWords, setAnsweredWords] = useState([]);

    const loadQuiz = useCallback(async () => {
        setLoading(true);
        let quizWords = [];

        if (favorites.length >= 5) {
            const shuffled = [...favorites].sort(() => 0.5 - Math.random());
            quizWords = shuffled.slice(0, 10);
        } else {
            const randomCount = 10 - favorites.length;
            const randoms = [];

            if (randomCount > 0) {
                const fetchedRandoms = await getExploreWords(randomCount);
                if (fetchedRandoms) {
                    randoms.push(...fetchedRandoms);
                }
            }

            quizWords = [...favorites, ...randoms];
        }

        console.log("Quiz loaded with words:", quizWords.length);

        setCards(quizWords);
        setCurrentIndex(0);
        setScore(0);
        setQuizComplete(false);
        setIsFlipped(false);
        setAnsweredWords([]);
        setLoading(false);
    }, [favorites]);

    useEffect(() => {
        loadQuiz();
    }, [loadQuiz]);

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const handleNext = async (correct) => {
        // Track answered word
        const currentCard = cards[currentIndex];
        const newAnsweredWords = [...answeredWords, {
            term: currentCard.term,
            correct
        }];
        setAnsweredWords(newAnsweredWords);

        if (correct) {
            setScore(s => s + 1);
        }

        if (currentIndex < cards.length - 1) {
            // Next card
            setIsFlipped(false);
            setCurrentIndex(c => c + 1);
        } else {
            // Quiz complete - save result
            const finalScore = correct ? score + 1 : score;
            await saveQuizResult({
                score: finalScore,
                total: cards.length,
                words: [...newAnsweredWords] // Use the updated array
            });
            setQuizComplete(true);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <View style={styles.loadingDot} />
                    <Text style={styles.loadingText}>Loading Quiz...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (quizComplete) {
        const percentage = cards.length > 0 ? Math.round((score / cards.length) * 100) : 0;
        const emoji = percentage >= 80 ? '🎉' : percentage >= 50 ? '💪' : '📚';
        const message = percentage >= 80 ? 'Amazing!' : percentage >= 50 ? 'Good job!' : 'Keep practicing!';

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <View style={styles.celebrationContainer}>
                        <View style={styles.trophyContainer}>
                            <Ionicons name="trophy" size={64} color="#F59E0B" />
                        </View>
                        <Text style={styles.completeEmoji}>{emoji}</Text>
                        <Text style={styles.completeTitle}>{message}</Text>
                        <Text style={styles.scoreText}>
                            You got <Text style={styles.scoreHighlight}>{score}</Text> out of <Text style={styles.scoreHighlight}>{cards.length}</Text>
                        </Text>

                        <View style={styles.percentageCircle}>
                            <Text style={[styles.percentageText, { color: percentage >= 60 ? '#10B981' : '#EF4444' }]}>
                                {percentage}%
                            </Text>
                        </View>

                        <View style={styles.completionButtons}>
                            <TouchableOpacity
                                style={styles.restartButton}
                                onPress={loadQuiz}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="refresh" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>Play Again</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.historyButton}
                                onPress={() => navigation.navigate('QuizHistory')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="time" size={20} color="#4F46E5" style={{ marginRight: 8 }} />
                                <Text style={styles.historyButtonText}>View History</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.secondaryButtonText}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (cards.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.loadingText}>No words available.</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.secondaryButton, { marginTop: 20 }]}>
                        <Text style={styles.secondaryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const currentCard = cards[currentIndex];
    const progressPercent = ((currentIndex + 1) / cards.length) * 100;

    return (
        <LinearGradient colors={["#F8F9FC", "#F0F2F8", "#EEF1F7"]} style={{ flex: 1 }}>
            <FloatingShapes />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={24} color="#4B5563" />
                    </TouchableOpacity>

                    <View style={styles.progressContainer}>
                        <Text style={styles.progress}>Card {currentIndex + 1} / {cards.length}</Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${progressPercent}%` }
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.scoreContainer}>
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text style={styles.scoreLabel}>{score}</Text>
                    </View>
                </View>

                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <View style={[styles.cardInner]}>
                            <View style={[styles.labelBadge, isFlipped && styles.labelBadgeFlipped]}>
                                <Text style={styles.label}>{isFlipped ? 'DEFINITION' : 'TERM'}</Text>
                            </View>

                            {!isFlipped ? (
                                <>
                                    <Text style={styles.term}>{formatTerm(currentCard.term)}</Text>
                                    <Text style={styles.pos}>{partOfSpeechLegend[currentCard.partOfSpeech]}</Text>
                                    <View style={styles.hintContainer}>
                                        <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.hint}>Tap to reveal definition</Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.definition}>{currentCard.definition}</Text>
                                    <View style={styles.termReminder}>
                                        <Text style={styles.termReminderLabel}>Term:</Text>
                                        <Text style={styles.termReminderText}>{formatTerm(currentCard.term)}</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.controls}>
                    {!isFlipped ? (
                        <TouchableOpacity
                            style={styles.revealButton}
                            onPress={handleFlip}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="eye" size={22} color="#FFF" style={{ marginRight: 10 }} />
                            <Text style={styles.revealButtonText}>Reveal Answer</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.missedBtn]}
                                onPress={() => handleNext(false)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="close-circle" size={32} color="#EF4444" />
                                <Text style={styles.missedText}>Missed it</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionBtn, styles.gotBtn]}
                                onPress={() => handleNext(true)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                                <Text style={styles.gotText}>Got it!</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loadingDot: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4F46E5',
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    iconButton: {
        padding: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
    },
    progressContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    progress: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 6,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4F46E5',
        borderRadius: 3,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        gap: 6,
    },
    scoreLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#D97706',
    },
    cardContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 28,
        width: '100%',
        minHeight: 380,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 28,
        elevation: 12,
    },
    cardInner: {
        alignItems: 'center',
        width: '100%',
    },
    cardFlipped: {},
    labelBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 20,
    },
    labelBadgeFlipped: {
        backgroundColor: '#F0FDF4',
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#4F46E5',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    term: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    pos: {
        fontSize: 15,
        color: '#6B7280',
        fontStyle: 'italic',
        marginBottom: 32,
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    hint: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    definition: {
        fontSize: 20,
        fontWeight: '500',
        color: '#374151',
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 28,
    },
    termReminder: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    termReminderLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    termReminderText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4B5563',
    },
    controls: {
        padding: 20,
        paddingBottom: 36,
    },
    revealButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
    },
    revealButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 22,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    missedBtn: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2',
    },
    gotBtn: {
        borderColor: '#6EE7B7',
        backgroundColor: '#ECFDF5',
    },
    missedText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#DC2626',
    },
    gotText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#059669',
    },
    celebrationContainer: {
        alignItems: 'center',
        width: '100%',
    },
    trophyContainer: {
        backgroundColor: '#FEF3C7',
        padding: 24,
        borderRadius: 40,
        marginBottom: 16,
    },
    completeEmoji: {
        fontSize: 52,
        marginBottom: 8,
    },
    completeTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 12,
    },
    scoreText: {
        fontSize: 18,
        color: '#4B5563',
        marginBottom: 16,
    },
    scoreHighlight: {
        fontWeight: '800',
        color: '#4F46E5',
    },
    percentageCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        borderWidth: 4,
        borderColor: '#E5E7EB',
    },
    percentageText: {
        fontSize: 22,
        fontWeight: '800',
    },
    completionButtons: {
        width: '100%',
        gap: 12,
        marginBottom: 8,
    },
    restartButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    historyButton: {
        backgroundColor: '#EEF2FF',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#C7D2FE',
    },
    historyButtonText: {
        color: '#4F46E5',
        fontSize: 17,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: 16,
    },
    secondaryButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',
    },
});
