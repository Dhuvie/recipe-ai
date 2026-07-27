export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

export async function streamRecipe(
  prompt: string,
  history: any[],
  signal: AbortSignal,
  onBlock: (block: any) => void
): Promise<void> {
  const response = await fetch('/api/recipe/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, history }),
    signal
  });

  if (!response.ok) {
    throw new ApiError('PROVIDER_ERROR', 'Provider error');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError('NETWORK_ERROR', 'No stream available');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    let lines = buffer.split('\n');
    
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const dataStr = line.replace('data: ', '').trim();
        if (dataStr === '{}') continue; 
        try {
          const block = JSON.parse(dataStr);
          if (block.code === 'PROVIDER_ERROR') {
            throw new ApiError('PROVIDER_ERROR', 'Provider error in stream');
          }
          onBlock(block);
        } catch (e) {
          // Ignore malformed JSON chunks that might happen during stream
        }
      } else if (line.startsWith('event: error')) {
        throw new ApiError('PROVIDER_ERROR', 'Provider error');
      }
    }
  }
}
