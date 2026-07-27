import { useState } from 'react';

import type { Recipe } from '../lib/recipeSchema';
import { Check } from 'lucide-react';

interface StepListProps {
  steps: Recipe['steps'];
}

export function StepList({ steps }: StepListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="step-list">
      <h3>Instructions</h3>
      <ul className="checklist steps">
        {steps.map((step, index) => {
          const isChecked = checkedItems.has(index);
          
          return (
            <li 
              key={index} 
              className={`check-item ${isChecked ? 'checked' : ''}`}
            >
              <button 
                className="check-btn" 
                onClick={() => toggleCheck(index)}
                aria-label={isChecked ? 'Mark step as incomplete' : 'Mark step as complete'}
              >
                {isChecked && <Check size={14} className="check-icon" />}
              </button>
              
              <div className="item-content">
                <span className="step-number">{index + 1}.</span>
                <span className="step-text">{step}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
