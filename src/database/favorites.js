import { getDb } from "./initializeConnection";

/*
Favorites table schema:
wordId TEXT PRIMARY KEY,
term TEXT NOT NULL,
partOfSpeech TEXT,
definition TEXT
*/

export async function addFavorite(word) {
    try {
        const db = await getDb();
        await db.runAsync(
            `INSERT OR REPLACE INTO favorites (wordId, term, partOfSpeech, definition) VALUES (?, ?, ?, ?);`,
            [word.wordId, word.term, word.partOfSpeech, word.definition]
        );
        console.log(`Added favorite: ${word.term}`);
        return true;
    } catch (error) {
        console.error("Error adding favorite:", error);
        return false;
    }
}

export async function removeFavorite(wordId) {
    try {
        const db = await getDb();
        await db.runAsync(`DELETE FROM favorites WHERE wordId = ?;`, [wordId]);
        console.log(`Removed favorite: ${wordId}`);
        return true;
    } catch (error) {
        console.error("Error removing favorite:", error);
        return false;
    }
}

export async function isFavorite(wordId) {
    try {
        const db = await getDb();
        const result = await db.getAllAsync(`SELECT wordId FROM favorites WHERE wordId = ?;`, [wordId]);
        return result.length > 0;
    } catch (error) {
        console.error("Error checking favorite status:", error);
        return false;
    }
}

export async function getFavorites() {
    try {
        const db = await getDb();
        const result = await db.getAllAsync(`SELECT * FROM favorites ORDER BY term COLLATE NOCASE ASC;`);
        return result;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
}
