import React, { useState } from 'react';
import { Recipe } from '../lib/recipeSchema';
import { ServingsAdjuster } from './ServingsAdjuster';
import { IngredientList } from './IngredientList';
import { StepList } from './StepList';
import { Clock, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [currentServings, setCurrentServings] = useState(recipe.baseServings);
  
  const scaleFactor = currentServings / recipe.baseServings;

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        <p className="recipe-description">{recipe.description}</p>
        
        <div className="recipe-meta">
          <div className="meta-badge">
            <ChefHat size={16} />
            <span>Prep: {recipe.prepTime}</span>
          </div>
          <div className="meta-badge">
            <Clock size={16} />
            <span>Cook: {recipe.cookTime}</span>
          </div>
        </div>
      </div>
      
      <div className="recipe-body">
        <div className="ingredients-section">
          <ServingsAdjuster 
            servings={currentServings} 
            onChange={setCurrentServings} 
          />
          <IngredientList 
            ingredients={recipe.ingredients} 
            scaleFactor={scaleFactor} 
          />
        </div>
        
        <div className="steps-section">
          <StepList steps={recipe.steps} />
        </div>
      </div>
    </div>
  );
}
