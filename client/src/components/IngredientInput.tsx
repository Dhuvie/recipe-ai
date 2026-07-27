import { useState } from 'react';
import type { KeyboardEvent } from 'react';


interface IngredientInputProps {
  onSubmit: (ingredients: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function IngredientInput({ onSubmit, isLoading, initialValue = '' }: IngredientInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-container">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What ingredients do you have? (e.g., eggs, cheese, milk)"
        disabled={isLoading}
        className="ingredient-textarea"
        rows={4}
      />
      <div className="input-actions">
        <span className="hint">Ctrl + Enter to submit</span>
        <button 
          onClick={handleSubmit} 
          disabled={!value.trim() || isLoading}
          className="submit-btn"
        >
          {isLoading ? 'Cooking...' : 'Get Recipe'}
        </button>
      </div>
    </div>
  );
}
