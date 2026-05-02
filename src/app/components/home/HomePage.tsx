import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { Play, ChevronRight, Star, Heart, TrendingUp, Trophy, Zap } from "lucide-react";
import { RatingStars } from "../ui/RatingStars";

const ACCENT = "#00aaff";
const BORDER = "rgba(255,255,255,0.07)";
const CARD = "#0e0e1c";

function SectionHeader({ icon: Icon, title, accentColor = ACCENT, onSeeAll }: { icon: React.ElementType; title: string; accentColor?: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full" style={{ background: accentColor }} />
        <Icon size={14} style={{ color: accentColor }} />
        <span className="text-white text-sm" style={{ fontWeight: 700 }}>{title}</span>
      </div>
      {onSeeAll && (
        <button onClick={onSeeAll} className="flex items-center gap-0.5 text-xs" style={{ color: ACCENT, fontWeight: 600 }}>
          SEE ALL <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { user, darkMode, toggleDarkMode, addToBacklog, removeFromBacklog, getBacklogStatus, games } = useApp();

  // Sort for each section
  const byPopularity = [...games].sort((a, b) => b.popularity - a.popularity);
  const byRating = [...games].sort((a, b) => b.rating - a.rating);
  const featured = byPopularity[0];
  const trending = byPopularity.slice(0, 5);
  const topRated = byRating.slice(0, 3);

  // Calculate trending categories
  const genreCount = new Map<string, number>();
  games.forEach((game) => {
    game.genres.forEach((genre) => {
      genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
    });
  });
  const trendingCategories = Array.from(genreCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const toggleWishlist = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (getBacklogStatus(gameId) === "want") removeFromBacklog(gameId);
    else addToBacklog(gameId, "want");
  };

  return (
    <div className="flex flex-col" style={{ background: "var(--spwn-bg)" }}>
      {/* ── Featured Hero ── */}
      <div
        className="relative mx-3 mt-3 rounded-xl overflow-hidden cursor-pointer"
        style={{ height: 220 }}
        onClick={() => navigate(`/app/game/${featured.id}`)}
      >
        <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded overlay-white" style={{ background: "var(--spwn-accent)", fontWeight: 700, fontSize: 10 }}>FEATURED</span>
            <span className="text-xs overlay-white-secondary">{featured.genres.slice(0, 2).join(" • ")}</span>
          </div>
          <h2 className="text-xl leading-tight mb-2 overlay-white" style={{ fontWeight: 800, maxWidth: 210 }}>{featured.title}</h2>
          <p className="text-xs leading-relaxed mb-4 overlay-white-muted" style={{ maxWidth: 200 }}>{featured.description.slice(0, 90)}…</p>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs overlay-white"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", fontWeight: 600, backdropFilter: "blur(8px)" }}
            >
              <Play size={11} fill="white" stroke="none" />
              View Details
            </button>
            <button
              onClick={(e) => toggleWishlist(e, featured.id)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
              style={{
                background: getBacklogStatus(featured.id) === "want" ? "rgba(0,170,255,0.2)" : "rgba(255,255,255,0.1)",
                border: `1px solid ${getBacklogStatus(featured.id) === "want" ? "rgba(0,170,255,0.5)" : "rgba(255,255,255,0.2)"}`,
              }}
            >
              <Heart size={13} fill={getBacklogStatus(featured.id) === "want" ? "var(--spwn-accent)" : "none"} stroke={getBacklogStatus(featured.id) === "want" ? "var(--spwn-accent)" : "white"} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Trending This Week ── */}
      <div className="mt-6 px-4">
        <SectionHeader icon={TrendingUp} title="Trending This Week" onSeeAll={() => navigate("/app/discover")} />
        <p className="text-white/30 text-xs mb-3">The most popular games on SPWN right now.</p>
        <div className="flex flex-col gap-2">
          {trending.map((game, i) => (
            <div
              key={game.id}
              onClick={() => navigate(`/app/game/${game.id}`)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:scale-[0.98] transition-all"
              style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
            >
              <span className="text-white/20 text-sm w-5 text-center shrink-0" style={{ fontWeight: 700 }}>{i + 1}</span>
              <img src={game.image} alt={game.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{game.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{game.year} • {game.genres[0]}</p>
              </div>
              <div className="flex items-center gap-2">
                <RatingStars rating={game.rating} className="px-1.5 py-0.5 rounded text-xs" />
                <button onClick={(e) => toggleWishlist(e, game.id)}>
                  <Heart size={14} fill={getBacklogStatus(game.id) === "want" ? "var(--spwn-accent)" : "none"} stroke={getBacklogStatus(game.id) === "want" ? "var(--spwn-accent)" : "rgba(255,255,255,0.3)"} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Rated ── */}
      <div className="mt-6 px-4">
        <SectionHeader icon={Trophy} title="Top Rated All-Time" onSeeAll={() => navigate("/app/games")} />
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {topRated.map((game, i) => (
            <div
              key={game.id}
              onClick={() => navigate(`/app/game/${game.id}`)}
              className="rounded-xl overflow-hidden shrink-0 cursor-pointer relative"
              style={{ width: 140, background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
            >
              <img src={game.image} alt={game.title} className="w-full h-24 object-cover" />
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center overlay-white"
                style={{ background: ["#f59e0b", "#94a3b8", "#cd7c2f"][i], fontSize: 10, fontWeight: 800 }}>
                {i + 1}
              </div>
              <div className="absolute top-2 right-2"><RatingStars rating={game.rating} className="px-1.5 py-0.5 rounded text-xs" /></div>
              <div className="p-2.5">
                <p className="text-xs truncate overlay-white" style={{ fontWeight: 600 }}>{game.title}</p>
                <p className="text-xs mt-0.5 overlay-white-secondary">{game.developer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trending Categories (Reports) ── */}
      <div className="mt-6 px-4 pb-6">
        <SectionHeader icon={Zap} title="Trending Categories" />
        <p className="text-white/30 text-xs mb-3">Most active genres on the platform.</p>
        <div className="flex flex-col gap-2">
          {trendingCategories.map(([genre, count], i) => {
            const pct = Math.round((count / games.length) * 100);
            return (
              <div
                key={genre}
                onClick={() => navigate(`/app/discover?genre=${encodeURIComponent(genre)}`)}
                className="rounded-xl p-3 cursor-pointer"
                style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white/25 text-xs w-4" style={{ fontWeight: 700 }}>#{i + 1}</span>
                    <span className="text-white text-sm" style={{ fontWeight: 600 }}>{genre}</span>
                  </div>
                  <span className="text-white/40 text-xs">{count} game{count !== 1 ? "s" : ""}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--spwn-glass)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct + 20}%`,
                      background: `linear-gradient(to right, var(--spwn-accent), rgba(0,170,255,0.4))`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}