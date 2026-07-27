import { useState, useRef } from 'react';
import { streamRecipe, ApiError } from '../api/recipeApi';
import type { ChatMessage } from './useSessions';

export function useRecipe() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = async (prompt: string, currentHistory: ChatMessage[] = []) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    
    // When generating a refinement, we keep old blocks? Or we replace them? 
    // The AI will regenerate the entire recipe blocks updated. So we clear blocks.
    setBlocks([]);
    
    try {
      await streamRecipe(
        prompt, 
        currentHistory, 
        abortControllerRef.current.signal,
        (block) => {
          setBlocks(prev => [...prev, block]);
        }
      );
      
      // Generation successful. Add to history
      setHistory([
        ...currentHistory,
        { role: 'user', text: prompt },
        { role: 'model', text: 'Recipe updated successfully.' }
      ]);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err instanceof ApiError ? err.code : 'UNKNOWN_ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const loadSessionState = (loadedBlocks: any[], loadedHistory: ChatMessage[]) => {
    setBlocks(loadedBlocks);
    setHistory(loadedHistory);
    setError(null);
    setIsLoading(false);
  };

  return {
    blocks,
    history,
    isLoading,
    error,
    generate,
    stop,
    loadSessionState,
    setBlocks,
  };
}
