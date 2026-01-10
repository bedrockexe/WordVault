import { getDb } from "./initializeConnection";

/* 
  Used for the viewmodels/useGetWordDetails.js hook
  expects: wordId - a number that is the same as the wordId primary key of the words table
  returns: [ 
    {
      example: "This word is used in this context", 
      exampleId: 69, 
    }
  ]
*/
export async function searchExamples(wordId) {
  try {
    const dbConnection = await getDb();
    const rows = await dbConnection.getAllAsync("SELECT example, exampleId FROM examples WHERE wordId = ?", [wordId]);
    return rows;
  } catch (err) {
    console.error("Word search error: ", err);
    return [];
  }
}