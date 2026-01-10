import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    saveQuizResult as saveQuizResultDb,
    getQuizHistory as getQuizHistoryDb,
    getQuizStats as getQuizStatsDb,
    clearQuizHistory as clearQuizHistoryDb
} from '../database/quizHistory';

export function useQuizHistory() {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ totalQuizzes: 0, averageScore: 0, bestScore: 0, totalWords: 0 });
    const [loading, setLoading] = useState(true);

    const refreshHistory = useCallback(async () => {
        setLoading(true);
        const [historyData, statsData] = await Promise.all([
            getQuizHistoryDb(),
            getQuizStatsDb()
        ]);
        setHistory(historyData);
        setStats(statsData);
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            refreshHistory();
        }, [refreshHistory])
    );

    const saveQuizResult = async (result) => {
        const saved = await saveQuizResultDb(result);
        if (saved) {
            await refreshHistory();
        }
        return saved;
    };

    const clearHistory = async () => {
        await clearQuizHistoryDb();
        setHistory([]);
        setStats({ totalQuizzes: 0, averageScore: 0, bestScore: 0, totalWords: 0 });
    };

    return {
        history,
        stats,
        loading,
        saveQuizResult,
        clearHistory,
        refreshHistory
    };
}
