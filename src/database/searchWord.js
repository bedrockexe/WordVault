import { getDb } from "./initializeConnection";

/* 
  Used for the viewmodels/useSearch.js hook
  expects: term - a string word
  returns: [ 
    {
      term: "happy", 
      definition: "Definition of happy is blablabla", 
      partOfSpeech: "a", 
      wordId: 1
    }
  ]
*/
export async function searchWord(term) {
  try {
    const dbConnection = await getDb();
    if (!term) {
      return [];
    }
    const rows = await dbConnection.getAllAsync("SELECT * FROM words WHERE term LIKE ? LIMIT 10", `${term}%`);
    return rows;
  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
}
