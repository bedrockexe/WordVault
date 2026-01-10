import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { addToHistory as addToHistoryDb, getHistory as getHistoryDb, clearHistory as clearHistoryDb } from '../database/history';

export function useHistory() {
    const [history, setHistory] = useState([]);

    const refreshHistory = useCallback(async () => {
        const data = await getHistoryDb();
        setHistory(data);
    }, []);

    useFocusEffect(
        useCallback(() => {
            refreshHistory();
        }, [refreshHistory])
    );

    const addToHistory = async (word) => {
        await addToHistoryDb(word);
        // We don't necessarily need to refresh immediately if we are just adding,
        // but if we are on the history screen it might be useful.
        // However, usually we add from WordScreen, so refresh happening on Focus of HistoryScreen is enough.
    };

    const clearHistory = async () => {
        await clearHistoryDb();
        setHistory([]);
    };

    return {
        history,
        addToHistory,
        clearHistory,
        refreshHistory
    };
}
