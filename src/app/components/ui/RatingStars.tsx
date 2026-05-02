import { Star } from "lucide-react";

export function RatingStars({
    rating,
    size = 9,
    showValue = true,
    className = "",
    valueClassName = "",
}: {
    rating: number;
    size?: number;
    showValue?: boolean;
    className?: string;
    valueClassName?: string;
}) {
    const displayRating = Math.min(5, Math.max(0, rating / 2));

    return (
        <div className={`flex items-center gap-1 ${className}`} style={{ color: "#f59e0b", fontWeight: 700 }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const fillFraction = Math.min(1, Math.max(0, displayRating - (star - 1)));
                return (
                    <span key={star} className="relative inline-flex" style={{ width: size, height: size }}>
                        <Star
                            size={size}
                            fill="none"
                            stroke={fillFraction > 0 ? "#f59e0b" : "rgba(255,255,255,0.25)"}
                            strokeWidth={1.5}
                        />
                        {fillFraction > 0 && (
                            <span
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillFraction * 100}%`, display: "inline-flex" }}
                            >
                                <Star size={size} fill="#f59e0b" stroke="#f59e0b" strokeWidth={1.5} />
                            </span>
                        )}
                    </span>
                );
            })}
            {showValue && (
                <span className={valueClassName} style={{ color: "#f59e0b", fontWeight: 700, fontSize: 10 }}>
                    {displayRating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
