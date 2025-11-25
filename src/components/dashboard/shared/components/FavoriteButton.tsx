// src/components/dashboard/shared/components/FavoriteButton.tsx
import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { useFavorites } from '../../../../contexts/FavoritesContext';
import { PropertyResponse } from '../../../../../api';
import { cn } from '../../../ui/utils';

interface FavoriteButtonProps {
  property: PropertyResponse;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ 
  property, 
  className = '',
  size = 'md'
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  
  const favorite = isFavorite(property.propertyId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    try {
      setIsLoading(true);
      await toggleFavorite(property);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        'rounded-full shadow-md transition-all hover:scale-110',
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin text-gray-600')} />
      ) : (
        <Heart
          className={cn(
            iconSizes[size],
            'transition-all',
            favorite 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-700 hover:text-red-500'
          )}
        />
      )}
    </Button>
  );
}