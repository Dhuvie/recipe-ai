import React, { useState } from 'react';
import { Recipe } from '../lib/recipeSchema';
import { Check, RefreshCw } from 'lucide-react';

interface IngredientListProps {
  ingredients: Recipe['ingredients'];
  scaleFactor: number;
}

export function IngredientList({ ingredients, scaleFactor }: IngredientListProps) {
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

  const formatAmount = (amount: number) => {
    const scaled = amount * scaleFactor;
    if (scaled === 0) return '';
    const formatted = parseFloat(scaled.toFixed(2)).toString();
    return formatted;
  };

  return (
    <div className="ingredient-list">
      <h3>Ingredients</h3>
      <ul className="checklist">
        {ingredients.map((ingredient, index) => {
          const isChecked = checkedItems.has(index);
          const amount = formatAmount(ingredient.amount);
          
          return (
            <li 
              key={index} 
              className={`check-item ${isChecked ? 'checked' : ''}`}
            >
              <button 
                className="check-btn" 
                onClick={() => toggleCheck(index)}
                aria-label={isChecked ? 'Uncheck ingredient' : 'Check ingredient'}
              >
                {isChecked && <Check size={14} className="check-icon" />}
              </button>
              
              <div className="item-content">
                <span className="ingredient-text">
                  {amount} {ingredient.unit} {ingredient.name}
                </span>
                
                {ingredient.swapSuggestion && (
                  <div className="swap-pill">
                    <RefreshCw size={12} />
                    <span>Swap: {ingredient.swapSuggestion}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
