'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  totalStars?: number;
  size?: number;
  fillColor?: string;
  emptyColor?: string;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}

export function Rating({
  value = 0,
  totalStars = 5,
  size = 24,
  fillColor = 'text-yellow-400', // Use Tailwind class
  emptyColor = 'text-muted-foreground', // Use Tailwind class
  onChange,
  disabled = false,
  className,
  ...props
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | undefined>(undefined);

  const handleMouseOver = (index: number) => {
    if (!disabled) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(undefined);
    }
  };

  const handleClick = (index: number) => {
    if (!disabled && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer", className)} {...props}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverValue ?? value);

        return (
          <Star
            key={index}
            size={size}
            className={cn(
              isFilled ? fillColor : emptyColor,
              "transition-colors duration-150"
            )}
            fill={isFilled ? 'currentColor' : 'none'}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            aria-label={`Rate ${starValue} out of ${totalStars}`}
            role="radio"
            aria-checked={value === starValue}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                handleClick(index);
              }
            }}
          />
        );
      })}
    </div>
  );
}
