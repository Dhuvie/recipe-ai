import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  let message = 'An unexpected error occurred.';

  switch (error) {
    case 'PARSE_ERROR':
      message = "The AI returned a response we couldn't read. It happens - hit Retry!";
      break;
    case 'SCHEMA_ERROR':
      message = "The AI response was missing key fields. Try rephrasing your ingredients.";
      break;
    case 'PROVIDER_ERROR':
      message = "Couldn't reach the AI service. Check your connection or API key.";
      break;
    case 'TIMEOUT_ERROR':
      message = "The request took too long (>25 s). The AI might be busy - Retry?";
      break;
    case 'NETWORK_ERROR':
      message = "Network error. Are you connected to the internet?";
      break;
  }

  return (
    <div className="error-state">
      <AlertCircle className="error-icon" size={48} />
      <h3>Oops! Something went wrong</h3>
      <p>{message}</p>
      <button onClick={onRetry} className="retry-btn">
        Retry
      </button>
    </div>
  );
}
