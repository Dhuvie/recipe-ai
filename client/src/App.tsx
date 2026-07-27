import React from 'react';
import { useRecipe } from './hooks/useRecipe';
import { IngredientInput } from './components/IngredientInput';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { RecipeCard } from './components/RecipeCard';
import './App.css';

function App() {
  const { status, recipe, error, submitIngredients, retry } = useRecipe();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Fridge to Recipe</h1>
        <p>Turn what you have into a delicious meal</p>
      </header>
      
      <main className="app-main">
        <section className="input-section">
          <IngredientInput 
            onSubmit={submitIngredients} 
            isLoading={status === 'loading'} 
          />
        </section>

        <section className="content-section">
          {status === 'idle' && (
            <EmptyState onExampleClick={submitIngredients} />
          )}

          {status === 'loading' && (
            <LoadingState />
          )}

          {status === 'error' && error && (
            <ErrorState error={error} onRetry={retry} />
          )}

          {status === 'success' && recipe && (
            <RecipeCard recipe={recipe} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
