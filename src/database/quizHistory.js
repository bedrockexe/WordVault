import AsyncStorage from '@react-native-async-storage/async-storage';

const QUIZ_HISTORY_KEY = '@quiz_history';

/*
  SAVE QUIZ RESULT
  Saves a quiz session with score, date, and words.
  result: { score, total, date, words: [{term, correct}] }
*/
export async function saveQuizResult(result) {
    try {
        const existing = await getQuizHistory();
        const newEntry = {
            id: Date.now().toString(),
            score: result.score,
            total: result.total,
            percentage: Math.round((result.score / result.total) * 100),
            date: new Date().toISOString(),
            words: result.words || [],
        };
        const updated = [newEntry, ...existing].slice(0, 50); // Keep last 50
        await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));
        return newEntry;
    } catch (error) {
        console.error("Error saving quiz result:", error);
        return null;
    }
}

/*
  GET QUIZ HISTORY
  Returns list of quiz sessions ordered by most recent.
*/
export async function getQuizHistory() {
    try {
        const data = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error fetching quiz history:", error);
        return [];
    }
}

/*
  GET QUIZ STATS
  Returns aggregated statistics.
*/
export async function getQuizStats() {
    try {
        const history = await getQuizHistory();
        if (history.length === 0) {
            return { totalQuizzes: 0, averageScore: 0, bestScore: 0, totalWords: 0 };
        }

        const totalQuizzes = history.length;
        const totalScore = history.reduce((sum, q) => sum + q.percentage, 0);
        const averageScore = Math.round(totalScore / totalQuizzes);
        const bestScore = Math.max(...history.map(q => q.percentage));
        const totalWords = history.reduce((sum, q) => sum + q.total, 0);

        return { totalQuizzes, averageScore, bestScore, totalWords };
    } catch (error) {
        console.error("Error getting quiz stats:", error);
        return { totalQuizzes: 0, averageScore: 0, bestScore: 0, totalWords: 0 };
    }
}

/*
  CLEAR QUIZ HISTORY
  Deletes all quiz history.
*/
export async function clearQuizHistory() {
    try {
        await AsyncStorage.removeItem(QUIZ_HISTORY_KEY);
        return true;
    } catch (error) {
        console.error("Error clearing quiz history:", error);
        return false;
    }
}
