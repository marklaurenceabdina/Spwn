import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { Star, Heart, ChevronRight } from "lucide-react";
import { BookOpen, Sword, LayoutGrid, Crosshair, Cpu, Zap, Shield, Ghost } from "lucide-react";
import { RatingStars } from "../ui/RatingStars";

const ACCENT = "#00aaff";
const BORDER = "rgba(255,255,255,0.07)";
const CARD = "#0e0e1c";

const genreIcons: Record<string, React.ElementType> = {
  RPG: BookOpen,
  Action: Sword,
  "Open World": LayoutGrid,
  FPS: Crosshair,
  Strategy: Cpu,
  "Action RPG": Sword,
  "Souls-like": Shield,
  Horror: Ghost,
  Fantasy: Zap,
};

export function GamesPage() {
  const navigate = useNavigate();
  const { addToBacklog, removeFromBacklog, getBacklogStatus, games } = useApp();
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const ALL_GENRES = Array.from(new Set(games.flatMap((g) => g.genres)));
  const byRating = [...games].sort((a, b) => b.rating - a.rating);

  const filteredByGenre = activeGenre
    ? games.filter((g) => g.genres.includes(activeGenre)).sort((a, b) => b.rating - a.rating)
    : null;

  const toggleWishlist = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (getBacklogStatus(gameId) === "want") removeFromBacklog(gameId);
    else addToBacklog(gameId, "want");
  };

  return (
    <div className="flex flex-col pb-6" style={{ background: "var(--spwn-bg)" }}>
      {/* Browse by Genre */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: "var(--spwn-accent)" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>Browse by Genre</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {ALL_GENRES.slice(0, 9).map((genre) => {
            const Icon = genreIcons[genre] ?? Zap;
            const isActive = activeGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setActiveGenre(isActive ? null : genre)}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all duration-200 active:scale-95"
                style={{
                  background: isActive ? "rgba(0,136,221,0.15)" : "var(--spwn-card)",
                  border: `1px solid ${isActive ? "rgba(0,136,221,0.4)" : "var(--spwn-border)"}`,
                }}
              >
                <Icon size={20} style={{ color: isActive ? "var(--spwn-accent)" : "rgba(100,120,255,0.8)" }} />
                <span
                  className="text-xs tracking-wide text-center px-1"
                  style={{ color: isActive ? "var(--spwn-accent)" : "rgba(100,120,255,0.8)", fontWeight: isActive ? 700 : 500, fontSize: 10 }}
                >
                  {genre.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre-filtered results */}
      {filteredByGenre && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ background: "var(--spwn-accent)" }} />
              <span className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>{activeGenre} Games</span>
            </div>
            <button onClick={() => setActiveGenre(null)} className="text-xs" style={{ color: "var(--spwn-faint)" }}>Clear</button>
          </div>
          <div className="flex flex-col gap-2.5">
            {filteredByGenre.slice(0, 10).map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/app/game/${game.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:scale-[0.98] transition-all"
                style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
              >
                <img src={game.image} alt={game.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontWeight: 600, color: "var(--spwn-text)" }}>{game.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--spwn-faint)" }}>{game.year} • {game.developer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <RatingStars rating={game.rating} />
                  </div>
                  <button onClick={(e) => toggleWishlist(e, game.id)}>
                    <Heart size={15} fill={getBacklogStatus(game.id) === "want" ? "var(--spwn-accent)" : "none"} stroke={getBacklogStatus(game.id) === "want" ? "var(--spwn-accent)" : "var(--spwn-faint)"} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Rated Games */}
      {!filteredByGenre && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ background: "var(--spwn-accent)" }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>Highest Rated</span>
            </div>
            <button onClick={() => navigate("/app/discover")} className="flex items-center gap-0.5 text-xs" style={{ color: "var(--spwn-accent)", fontWeight: 600 }}>
              SEE ALL <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {byRating.slice(0, 10).map((game, i) => (
              <div
                key={game.id}
                onClick={() => navigate(`/app/game/${game.id}`)}
                className="rounded-xl overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all"
                style={{ height: 100, background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
              >
                <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 p-3 flex items-end">
                  <div className="flex-1">
                    <p className="text-sm overlay-white" style={{ fontWeight: 700 }}>{game.title}</p>
                    <p className="text-xs overlay-white-secondary">{game.year} • {game.developer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <RatingStars rating={game.rating} />
                    </div>
                    <button onClick={(e) => toggleWishlist(e, game.id)}>
                      <Heart size={15} fill={getBacklogStatus(game.id) === "want" ? "var(--spwn-accent)" : "none"} stroke={getBacklogStatus(game.id) === "want" ? "var(--spwn-accent)" : "var(--spwn-faint)"} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-2.5 left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: i < 3 ? ["#f59e0b", "#94a3b8", "#cd7c2f"][i] : "var(--spwn-card)", border: "1px solid var(--spwn-border)", fontWeight: 800, color: i < 3 ? "white" : "var(--spwn-faint)" }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}