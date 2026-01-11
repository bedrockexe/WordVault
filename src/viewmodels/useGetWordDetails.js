import { useState, useEffect } from 'react';
import { searchExamples } from '../database/searchExamples';
import { searchSynonyms } from '../database/searchSynonyms';
import { searchAntonyms } from '../database/searchAntonyms';

// Provides state and state handlers for views/WordScreen.js 
export function useGetWordDetails(wordId) {
  const [examples, setExamples] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [antonyms, setAntonyms] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchDetails() {
      if (!wordId) {
        return;
      }
      const ex = await searchExamples(wordId);
      const syn = await searchSynonyms(wordId);
      const ant = await searchAntonyms(wordId);

      if (isMounted) {
        setExamples(ex);
        setSynonyms(syn);
        setAntonyms(ant);
      }
    }
    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [wordId]);

  return { examples, synonyms, antonyms };
  /* 
    examples = [ 
      {
        example: "This word is used in this context"
      }
    ]
    synonyms = [
      { 
        synonym: "ImSynonymWord" 
      }
    ]
    antonyms = [
      {
      antonym: "ImAntonymsWord",
      }
    ]
    pending = false || true
  */
}
