
import { Minus, Plus, Users } from 'lucide-react';

interface ServingsAdjusterProps {
  servings: number;
  onChange: (servings: number) => void;
}

export function ServingsAdjuster({ servings, onChange }: ServingsAdjusterProps) {
  const handleDecrement = () => {
    if (servings > 1) {
      onChange(servings - 1);
    }
  };

  const handleIncrement = () => {
    if (servings < 100) {
      onChange(servings + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      onChange(value);
    }
  };

  return (
    <div className="servings-adjuster">
      <div className="servings-label">
        <Users size={20} />
        <span>Servings</span>
      </div>
      <div className="servings-controls">
        <button 
          onClick={handleDecrement} 
          disabled={servings <= 1}
          className="adjust-btn"
          aria-label="Decrease servings"
        >
          <Minus size={16} />
        </button>
        <input 
          type="number" 
          value={servings} 
          onChange={handleInputChange}
          min={1}
          max={100}
          className="servings-input"
        />
        <button 
          onClick={handleIncrement} 
          disabled={servings >= 100}
          className="adjust-btn"
          aria-label="Increase servings"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
