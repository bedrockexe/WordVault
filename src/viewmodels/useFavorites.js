import { useState, useEffect, useCallback } from 'react';
import { addFavorite, removeFavorite, isFavorite, getFavorites } from '../database/favorites';
import { useFocusEffect } from '@react-navigation/native';

export function useFavorites() {
    const [favorites, setFavorites] = useState([]);

    const loadFavorites = useCallback(async () => {
        const favs = await getFavorites();
        setFavorites(favs);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [loadFavorites])
    );

    const addToFavorites = async (word) => {
        const success = await addFavorite(word);
        if (success) {
            await loadFavorites();
        }
        return success;
    };

    const removeFromFavorites = async (wordId) => {
        const success = await removeFavorite(wordId);
        if (success) {
            await loadFavorites();
        }
        return success;
    };

    const checkIsFavorite = async (wordId) => {
        return await isFavorite(wordId);
    };

    return {
        favorites,
        addToFavorites,
        removeFromFavorites,
        checkIsFavorite,
        refreshFavorites: loadFavorites
    };
}
