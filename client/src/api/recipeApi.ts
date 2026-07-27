import { Recipe, recipeSchema } from '../lib/recipeSchema';

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchRecipe(ingredients: string, signal: AbortSignal): Promise<Recipe> {
  const fetchPromise = fetch('/api/recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ingredients }),
    signal
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new ApiError('TIMEOUT_ERROR', 'Request timed out'));
    }, 25000);
    signal.addEventListener('abort', () => clearTimeout(timer));
  });

  let response;
  try {
    response = await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('NETWORK_ERROR', 'Network error');
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError('PROVIDER_ERROR', 'Provider error');
    }
    throw new ApiError(errorData.code || 'PROVIDER_ERROR', 'Provider error');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('PARSE_ERROR', 'Parse error');
  }

  const result = recipeSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError('SCHEMA_ERROR', 'Schema error');
  }

  return result.data;
}
