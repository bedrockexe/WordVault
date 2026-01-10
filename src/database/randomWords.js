import { getDb } from "./initializeConnection";

/*
  FETCHES A RANDOM WORD
  returns: {
    term: "happy", 
    definition: "Definition of happy...", 
    partOfSpeech: "a", 
    wordId: 1
  }
*/
export async function getRandomWord() {
    try {
        const db = await getDb();
        // Get a random word (efficiently for SQLite)
        const result = await db.getAllAsync(`
      SELECT * FROM words 
      ORDER BY RANDOM() 
      LIMIT 1;
    `);

        return result[0];
    } catch (error) {
        console.error("Error fetching random word:", error);
        return null;
    }
}

/*
  FETCHES MULTIPLE RANDOM WORDS
  count: number of words to fetch (default 10)
  returns: Array of word objects
*/
export async function getExploreWords(count = 10) {
    try {
        const db = await getDb();
        const result = await db.getAllAsync(`
      SELECT * FROM words 
      ORDER BY RANDOM() 
      LIMIT ?;
    `, [count]);

        return result;
    } catch (error) {
        console.error("Error fetching explore words:", error);
        return [];
    }
}
