import { useState } from 'react';
import { searchWord } from '../database/searchWord';

// Provides state and state handlers for views/SearchBar.js 
export function useSearch() {
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);

  async function searchFn(term) {
    const results = await searchWord(term);
    if (results.length === 0) {
      setError("No results found");
      setWords([]);
    } else {
      setWords(results);
      setError(null);
    }
  }

  return { words, error, searchFn };
  /* 
    words = 
    [ 
      {
        term: "able", 
        definition: "blablaba", 
        partOfSpeech: "a", 
        wordId: 1
      }
    ]
    error = "No results found" || null
  */
}
