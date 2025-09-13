import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleStarClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)} data-testid="rating-stars">
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= Math.floor(rating);
        const isPartiallyFilled = starRating === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "relative",
              interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"
            )}
            onClick={() => handleStarClick(starRating)}
            disabled={!interactive}
            data-testid={`star-${starRating}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-secondary text-secondary"
                  : "fill-muted text-muted"
              )}
            />
            {isPartiallyFilled && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating % 1) * 100}%` }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "fill-secondary text-secondary"
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
      <span className="text-sm text-muted-foreground ml-2" data-testid="rating-value">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
