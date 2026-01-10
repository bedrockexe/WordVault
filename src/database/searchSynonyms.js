import { getDb } from "./initializeConnection";

/* 
  Used for the viewmodels/useGetWordDetails.js hook
  expects: wordId - a number that is the same as the wordId primary key of the words table
  returns: [ 
    {
      synonym: "ImSynonymWord", 
    }
  ]
*/
export async function searchSynonyms(wordId) {
  try {
    const dbConnection = await getDb();
    const rows = await dbConnection.getAllAsync(
      `SELECT w.term AS synonym
      FROM words w
      JOIN synonymPairs sp 
        ON (sp.synonymId = w.wordId OR sp.wordId = w.wordId)
      WHERE ? IN (sp.wordId, sp.synonymId)
        AND w.wordId != ?;
      `, [wordId, wordId]);
    return rows;
  } catch (err) {
    console.error("Synonym search error:", err);
    return [];
  }
}