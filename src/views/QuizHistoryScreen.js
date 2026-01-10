import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuizHistory } from '../viewmodels/useQuizHistory';
import FloatingShapes from '../components/FloatingShapes';
import { LinearGradient } from 'expo-linear-gradient';

const HistoryItem = ({ item, index }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return '#10B981';
        if (percentage >= 60) return '#F59E0B';
        return '#EF4444';
    };

    const getScoreEmoji = (percentage) => {
        if (percentage >= 90) return '🏆';
        if (percentage >= 80) return '⭐';
        if (percentage >= 60) return '👍';
        return '📚';
    };

    return (
        <View style={styles.historyItem}>
            <View style={styles.itemLeft}>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                <Text style={styles.wordsText}>{item.total} words</Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={styles.emoji}>{getScoreEmoji(item.percentage)}</Text>
                <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(item.percentage) + '20' }]}>
                    <Text style={[styles.scoreText, { color: getScoreColor(item.percentage) }]}>
                        {item.score}/{item.total}
                    </Text>
                </View>
                <Text style={[styles.percentText, { color: getScoreColor(item.percentage) }]}>
                    {item.percentage}%
                </Text>
            </View>
        </View>
    );
};

export default function QuizHistoryScreen() {
    const navigation = useNavigation();
    const { history, stats, loading, clearHistory } = useQuizHistory();

    const handleClearHistory = () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all quiz history? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        clearHistory();
                    }
                }
            ]
        );
    };

    const renderHistoryItem = ({ item, index }) => (
        <HistoryItem item={item} index={index} />
    );

    const renderStats = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Ionicons name="trophy" size={24} color="#F59E0B" />
                <Text style={styles.statValue}>{stats.bestScore}%</Text>
                <Text style={styles.statLabel}>Best</Text>
            </View>
            <View style={styles.statCard}>
                <Ionicons name="analytics" size={24} color="#4F46E5" />
                <Text style={styles.statValue}>{stats.averageScore}%</Text>
                <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statCard}>
                <Ionicons name="layers" size={24} color="#10B981" />
                <Text style={styles.statValue}>{stats.totalQuizzes}</Text>
                <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            <View style={styles.statCard}>
                <Ionicons name="book" size={24} color="#EC4899" />
                <Text style={styles.statValue}>{stats.totalWords}</Text>
                <Text style={styles.statLabel}>Words</Text>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={["#F8F9FC", "#F0F2F8", "#EEF1F7"]} style={{ flex: 1 }}>
            <FloatingShapes />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Quiz History</Text>
                    {history.length > 0 && (
                        <TouchableOpacity
                            onPress={handleClearHistory}
                            style={styles.clearButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : history.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>No Quiz History</Text>
                        <Text style={styles.emptyText}>Complete your first quiz to see your progress here!</Text>
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => navigation.navigate('Quiz')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.startButtonText}>Start a Quiz</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={history}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={renderStats}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    clearButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#FEE2E2',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 8,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },
    listContent: {
        paddingBottom: 24,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    itemLeft: {
        flex: 1,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    wordsText: {
        fontSize: 13,
        color: '#6B7280',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emoji: {
        fontSize: 20,
    },
    scoreBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: '700',
    },
    percentText: {
        fontSize: 16,
        fontWeight: '800',
        minWidth: 45,
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    startButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 14,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
