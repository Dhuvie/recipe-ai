import React from 'react';
import { ChefHat } from 'lucide-react';

interface EmptyStateProps {
  onExampleClick: (example: string) => void;
}

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  const examples = [
    'eggs, spinach, feta cheese',
    'chicken breast, broccoli, soy sauce',
    'pasta, canned tomatoes, garlic'
  ];

  return (
    <div className="empty-state">
      <div className="hero-icon">
        <ChefHat size={64} />
      </div>
      <h2>What is in your fridge?</h2>
      <p>Enter the ingredients you have on hand, and we will create a recipe for you.</p>
      
      <div className="examples">
        <p>Try one of these</p>
        <div className="example-chips">
          {examples.map((example, index) => (
            <button 
              key={index}
              className="chip"
              onClick={() => onExampleClick(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
