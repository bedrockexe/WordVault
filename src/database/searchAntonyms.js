import { getDb } from "./initializeConnection";

/* 
  Used for the viewmodels/useGetWordDetails.js hook
  expects: wordId - a number that is the same as the wordId primary key of the words table
  returns: [ 
    {
      synonym: "ImAntonymWord", 
    }
  ]
*/
export async function searchAntonyms(wordId) {
  try {
    const dbConnection = await getDb();
    const rows = await dbConnection.getAllAsync(
      `SELECT w.term AS antonym
      FROM words w
      JOIN antonymPairs ap 
        ON (ap.antonymId = w.wordId OR ap.wordId = w.wordId)
      WHERE ? IN (ap.wordId, ap.antonymId)
        AND w.wordId != ?;
      `, [wordId, wordId]);
    return rows;
  } catch (err) {
    console.error("Antonym search error:", err);
    return [];
  }
}