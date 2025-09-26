import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  increment?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const QtyStepper = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 999, 
  increment = 1,
  disabled = false,
  size = 'md' 
}: QtyStepperProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleDecrement = () => {
    const newValue = Math.max(min, value - increment);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + increment);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    
    const numValue = parseInt(inputVal, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // Snap to valid value on blur
    const numValue = parseInt(inputValue, 10);
    let validValue = value;
    
    if (!isNaN(numValue)) {
      validValue = Math.max(min, Math.min(max, numValue));
      
      // Snap to nearest increment
      const remainder = (validValue - min) % increment;
      if (remainder !== 0) {
        validValue = validValue + (increment - remainder);
      }
    }
    
    onChange(validValue);
    setInputValue(validValue.toString());
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9', 
    lg: 'h-10 w-10'
  };

  const inputClasses = {
    sm: 'h-8 w-16 text-sm',
    md: 'h-9 w-20',
    lg: 'h-10 w-24 text-lg'
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        className={sizeClasses[size]}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={`${inputClasses[size]} text-center`}
        disabled={disabled}
        min={min}
        max={max}
      />
      
      <Button
        variant="outline"
        size="icon"
        className={sizeClasses[size]}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default QtyStepper;