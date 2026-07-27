import { useState, useRef, useCallback } from 'react';
import { fetchRecipe, ApiError } from '../api/recipeApi';
import { Recipe } from '../lib/recipeSchema';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export function useRecipe() {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);
  const lastIngredientsRef = useRef<string>('');

  const submitIngredients = useCallback(async (ingredients: string) => {
    if (!ingredients.trim()) return;
    
    lastIngredientsRef.current = ingredients;
    setStatus('loading');
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;

    try {
      const data = await fetchRecipe(ingredients, controller.signal);
      
      if (currentRequestId === requestIdRef.current) {
        setRecipe(data);
        setStatus('success');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      if (currentRequestId === requestIdRef.current) {
        setStatus('error');
        if (err instanceof ApiError) {
          setError(err.code);
        } else {
          setError('NETWORK_ERROR');
        }
      }
    }
  }, []);

  const retry = useCallback(() => {
    if (lastIngredientsRef.current) {
      submitIngredients(lastIngredientsRef.current);
    }
  }, [submitIngredients]);

  return {
    status,
    recipe,
    error,
    submitIngredients,
    retry
  };
}
