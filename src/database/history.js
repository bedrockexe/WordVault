import { getDb } from "./initializeConnection";

/*
  ADD OR UPDATE HISTORY
  Inserts a word into history. If it exists, updates the timestamp.
  word: { wordId, term, partOfSpeech, definition }
*/
export async function addToHistory(word) {
  try {
    const db = await getDb();
    const timestamp = Date.now();
    await db.runAsync(`
      INSERT OR REPLACE INTO history (wordId, term, partOfSpeech, definition, timestamp)
      VALUES (?, ?, ?, ?, ?);
    `, [word.wordId, word.term, word.partOfSpeech, word.definition, timestamp]);
    return true;
  } catch (error) {
    console.error("Error adding to history:", error);
    return false;
  }
}

/*
  GET HISTORY
  Returns list of words ordered by most recently viewed.
  limit: max number of items to return (default 50)
*/
export async function getHistory(limit = 50) {
  try {
    const db = await getDb();
    const result = await db.getAllAsync(`
      SELECT * FROM history 
      ORDER BY timestamp DESC 
      LIMIT ?;
    `, [limit]);
    return result;
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

/*
  CLEAR HISTORY
  Deletes all entries from history table.
*/
export async function clearHistory() {
  try {
    const db = await getDb();
    await db.runAsync("DELETE FROM history;");
    return true;
  } catch (error) {
    console.error("Error clearing history:", error);
    return false;
  }
}
