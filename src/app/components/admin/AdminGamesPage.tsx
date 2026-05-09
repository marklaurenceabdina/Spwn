import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Game } from "../../data/games";
import { Plus, Trash2, Edit, X, ChevronDown } from "lucide-react";

export function AdminGamesPage() {
  const { games, createGame, updateGame, deleteGame, user } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredGameId, setFeaturedGameId] = useState<string | null>(games.find((g) => g.featured)?.id || null);

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGame = (data: Omit<Game, "id">) => {
    createGame(data);
    setIsCreating(false);
  };

  const handleUpdateGame = (gameId: string, data: Partial<Game>) => {
    updateGame(gameId, data);
    setEditingId(null);
  };

  const handleDeleteGame = (gameId: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      deleteGame(gameId);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full px-4" style={{ background: "var(--spwn-bg)" }}>
        <p style={{ color: "var(--spwn-text)" }}>Access Denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-6" style={{ background: "var(--spwn-bg)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl" style={{ fontWeight: 800, color: "var(--spwn-text)" }}>Games Management</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-all"
              style={{ background: "var(--spwn-accent)", fontWeight: 700 }}
            >
              <Plus size={16} />
              New Game
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "var(--spwn-card)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
          }}
        />

        {/* Featured Game Selector */}
        <div className="mt-4">
          <label style={{ color: "var(--spwn-faint)", fontSize: 12, display: "block", marginBottom: 6 }}>Featured Game</label>
          <select
            value={featuredGameId || ""}
            onChange={(e) => {
              const newFeaturedId = e.target.value || null;
              // Unfeature all games
              games.forEach((game) => {
                if (game.featured) {
                  updateGame(game.id, { featured: false });
                }
              });
              // Feature the selected game
              if (newFeaturedId) {
                updateGame(newFeaturedId, { featured: true });
              }
              setFeaturedGameId(newFeaturedId);
            }}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "var(--spwn-card)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          >
            <option value="">None</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Games List */}
      <div className="px-4 flex flex-col gap-2">
        {filteredGames.length === 0 ? (
          <div className="text-center py-8" style={{ color: "var(--spwn-faint)" }}>
            No games found
          </div>
        ) : (
          filteredGames.map((game) => (
            <div
              key={game.id}
              className="rounded-lg overflow-hidden"
              style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
            >
              {/* Game row */}
              <div className="p-3 flex items-center gap-3">

                {/* IMAGE + FEATURED BADGE */}
                <div className="relative w-12 h-12 shrink-0">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full rounded object-cover"
                  />

                  {game.featured && (
                    <div
                      className="absolute top-0 left-0"
                      style={{
                        background: "var(--spwn-accent)",
                        color: "white",
                        padding: "2px 6px",
                        borderTopLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        fontSize: 9,
                        fontWeight: 800,
                      }}
                    >
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: "var(--spwn-text)" }}>{game.title}</p>
                  <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>{game.developer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(editingId === game.id ? null : game.id)}
                    className="p-2 rounded"
                    style={{ background: "var(--spwn-glass)" }}
                  >
                    <Edit size={14} style={{ color: "var(--spwn-accent)" }} />
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game.id)}
                    className="p-2 rounded"
                    style={{ background: "var(--spwn-glass)" }}
                  >
                    <Trash2 size={14} style={{ color: "#ff6b6b" }} />
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === game.id ? null : game.id)}
                    className="p-2 rounded"
                    style={{ background: "var(--spwn-glass)" }}
                  >
                    <ChevronDown
                      size={14}
                      style={{
                        color: "var(--spwn-faint)",
                        transform: expandedId === game.id ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === game.id && (
                <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--spwn-border)" }}>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                    <div>
                      <p style={{ color: "var(--spwn-faint)" }}>Year</p>
                      <p style={{ color: "var(--spwn-text)" }}>{game.year}</p>
                    </div>
                    <div>
                      <p style={{ color: "var(--spwn-faint)" }}>Rating</p>
                      <p style={{ color: "var(--spwn-text)" }}>{game.rating}/10</p>
                    </div>
                    <div className="col-span-2">
                      <p style={{ color: "var(--spwn-faint)" }}>Genres</p>
                      <p style={{ color: "var(--spwn-text)" }}>{game.genres.join(", ")}</p>
                    </div>
                    <div className="col-span-2">
                      <p style={{ color: "var(--spwn-faint)" }}>Platforms</p>
                      <p style={{ color: "var(--spwn-text)" }}>{game.platform.join(", ")}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Form */}
              {editingId === game.id && (
                <GameEditForm
                  game={game}
                  onSave={(data) => handleUpdateGame(game.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreating && (
        <GameCreateForm
          onSave={handleCreateGame}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </div>
  );
}

function GameEditForm({
  game,
  onSave,
  onCancel,
}: {
  game: Game;
  onSave: (data: Partial<Game>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(game.title);
  const [rating, setRating] = useState(game.rating.toString());
  const [year, setYear] = useState(game.year.toString());
  const [description, setDescription] = useState(game.description);
  const [longDescription, setLongDescription] = useState(game.longDescription || "");
  const [image, setImage] = useState(game.image || "");
  const [trailerVideoId, setTrailerVideoId] = useState(game.trailerVideoId || "");
  const [tags, setTags] = useState((game.tags || []).join(", "));
  const [genresString, setGenresString] = useState((game.genres || []).join(", "));
  const [platform, setPlatform] = useState(game.platform || []);
  const [minSpecs, setMinSpecs] = useState(game.minSpecs || { os: "", cpu: "", ram: "", storage: "" });
  const [recSpecs, setRecSpecs] = useState(game.recSpecs || { os: "", cpu: "", ram: "", storage: "" });

  return (
    <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--spwn-border)" }}>
      <div className="pt-3 space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-2 py-1 rounded text-sm outline-none"
          style={{
            background: "var(--spwn-input)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
          }}
          placeholder="Title"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-2 py-1 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
            placeholder="Year"
          />
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            step="0.1"
            max="10"
            className="px-2 py-1 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
            placeholder="Rating"
          />
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-2 py-1 rounded text-sm outline-none"
          style={{
            background: "var(--spwn-input)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
            minHeight: "60px",
          }}
          placeholder="Description"
        />
        <textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          className="w-full px-2 py-1 rounded text-sm outline-none"
          style={{
            background: "var(--spwn-input)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
            minHeight: "80px",
          }}
          placeholder="Overview (long description)"
        />
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-2 py-1 rounded text-sm outline-none"
          style={{
            background: "var(--spwn-input)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
          }}
          placeholder="Overview Image URL"
        />
        <input
          type="text"
          value={trailerVideoId}
          onChange={(e) => setTrailerVideoId(e.target.value)}
          className="w-full px-2 py-1 rounded text-sm outline-none"
          style={{
            background: "var(--spwn-input)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
          }}
          placeholder="Trailer Video Link"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-2 py-1 rounded text-sm outline-none"
          style={{
            background: "var(--spwn-input)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
          }}
          placeholder="Tags (comma separated)"
        />
        <input
          type="text"
          value={genresString}
          onChange={(e) => setGenresString(e.target.value)}
          className="w-full px-2 py-1 rounded text-sm outline-none"
          style={{
            background: "var(--spwn-input)",
            border: "1px solid var(--spwn-border)",
            color: "var(--spwn-text)",
          }}
          placeholder="Genres (comma separated)"
        />
        <div>
          <p style={{ color: "var(--spwn-faint)", fontSize: 12, marginBottom: 4 }}>Platforms</p>
          <div className="flex gap-4">
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={platform.includes("Android")}
                onChange={(e) => {
                  const newPlatform = e.target.checked
                    ? [...platform, "Android"]
                    : platform.filter(p => p !== "Android");
                  setPlatform(newPlatform);
                }}
              />
              <span style={{ color: "var(--spwn-text)" }}>Android</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={platform.includes("iOS")}
                onChange={(e) => {
                  const newPlatform = e.target.checked
                    ? [...platform, "iOS"]
                    : platform.filter(p => p !== "iOS");
                  setPlatform(newPlatform);
                }}
              />
              <span style={{ color: "var(--spwn-text)" }}>iOS</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p style={{ color: "var(--spwn-faint)", fontSize: 12 }}>Minimum Specs</p>
            <input
              type="text"
              value={minSpecs.os}
              onChange={(e) => setMinSpecs({ ...minSpecs, os: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="OS"
            />
            <input
              type="text"
              value={minSpecs.cpu}
              onChange={(e) => setMinSpecs({ ...minSpecs, cpu: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="CPU"
            />
            <input
              type="text"
              value={minSpecs.ram}
              onChange={(e) => setMinSpecs({ ...minSpecs, ram: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="RAM"
            />
            <input
              type="text"
              value={minSpecs.storage}
              onChange={(e) => setMinSpecs({ ...minSpecs, storage: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="Storage"
            />
          </div>
          <div>
            <p style={{ color: "var(--spwn-faint)", fontSize: 12 }}>Recommended Specs</p>
            <input
              type="text"
              value={recSpecs.os}
              onChange={(e) => setRecSpecs({ ...recSpecs, os: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="OS"
            />
            <input
              type="text"
              value={recSpecs.cpu}
              onChange={(e) => setRecSpecs({ ...recSpecs, cpu: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="CPU"
            />
            <input
              type="text"
              value={recSpecs.ram}
              onChange={(e) => setRecSpecs({ ...recSpecs, ram: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="RAM"
            />
            <input
              type="text"
              value={recSpecs.storage}
              onChange={(e) => setRecSpecs({ ...recSpecs, storage: e.target.value })}
              className="w-full px-2 py-1 rounded text-sm outline-none mt-1"
              style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              placeholder="Storage"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              onSave({
                title,
                year: parseInt(year),
                rating: parseFloat(rating),
                description,
                longDescription,
                image,
                trailerVideoId,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                genres: genresString.split(",").map((g) => g.trim()).filter(Boolean),
                platform,
                minSpecs,
                recSpecs,
              });
            }}
            className="flex-1 px-3 py-2 rounded text-sm text-white"
            style={{ background: "var(--spwn-accent)", fontWeight: 600 }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 rounded text-sm"
            style={{
              background: "var(--spwn-glass)",
              color: "var(--spwn-text)",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function GameCreateForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<Game, "id">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<{
    title: string;
    developer: string;
    publisher: string;
    year: number;
    genres: string[];
    description: string;
    longDescription: string;
    image: string;
    rating: number;
    reviewCount: number;
    tags: string[];
    platform: string[];
    minSpecs: {
      os: string;
      cpu: string;
      ram: string;
      gpu: string;
      storage: string;
    };
    recSpecs: {
      os: string;
      cpu: string;
      ram: string;
      gpu: string;
      storage: string;
    };
    trailerVideoId: string;
    popularity: number;
    featured: boolean;
  }>({
    title: "",
    developer: "",
    publisher: "",
    year: new Date().getFullYear(),
    genres: [],
    description: "",
    longDescription: "",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 0,
    reviewCount: 0,
    tags: [],
    platform: [],
    minSpecs: {
      os: "",
      cpu: "",
      ram: "",
      gpu: "",
      storage: "",
    },
    recSpecs: {
      os: "",
      cpu: "",
      ram: "",
      gpu: "",
      storage: "",
    },
    trailerVideoId: "",
    popularity: 50,
    featured: false,
  });
  const [tagsString, setTagsString] = useState((formData.tags || []).join(", "));
  const [genresString, setGenresString] = useState((formData.genres || []).join(", "));

  const handleSubmit = () => {
    if (!formData.title || !formData.developer) {
      alert("Please fill in title and developer");
      return;
    }
    const payload = {
      ...formData,
      featured: formData.featured,
      tags: tagsString.split(",").map((t) => t.trim()).filter(Boolean),
      genres: genresString.split(",").map((g) => g.trim()).filter(Boolean),
    } as Omit<Game, "id">;
    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--spwn-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--spwn-text)" }}>
            Create New Game
          </h2>
          <button onClick={onCancel} className="p-1">
            <X size={18} style={{ color: "var(--spwn-faint)" }} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <input
            type="text"
            placeholder="Developer"
            value={formData.developer}
            onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <input
            type="text"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="px-3 py-2 rounded text-sm outline-none"
              style={{
                background: "var(--spwn-input)",
                border: "1px solid var(--spwn-border)",
                color: "var(--spwn-text)",
              }}
            />
            <input
              type="number"
              placeholder="Rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              step="0.1"
              max="10"
              className="px-3 py-2 rounded text-sm outline-none"
              style={{
                background: "var(--spwn-input)",
                border: "1px solid var(--spwn-border)",
                color: "var(--spwn-text)",
              }}
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
              minHeight: "80px",
            }}
          />
          <textarea
            placeholder="Overview (long description)"
            value={formData.longDescription}
            onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
              minHeight: "120px",
            }}
          />
          <input
            type="text"
            placeholder="Overview Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <input
            type="text"
            placeholder="Trailer Video Link"
            value={formData.trailerVideoId}
            onChange={(e) => setFormData({ ...formData, trailerVideoId: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tagsString}
            onChange={(e) => setTagsString(e.target.value)}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <input
            type="text"
            placeholder="Genres (comma separated)"
            value={genresString}
            onChange={(e) => setGenresString(e.target.value)}
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <div>
            <p style={{ color: "var(--spwn-faint)", fontSize: 12, marginBottom: 4 }}>Platforms</p>
            <div className="flex gap-4">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={formData.platform.includes("Android")}
                  onChange={(e) => {
                    const newPlatform = e.target.checked
                      ? [...formData.platform, "Android"]
                      : formData.platform.filter(p => p !== "Android");
                    setFormData({ ...formData, platform: newPlatform });
                  }}
                />
                <span style={{ color: "var(--spwn-text)" }}>Android</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={formData.platform.includes("iOS")}
                  onChange={(e) => {
                    const newPlatform = e.target.checked
                      ? [...formData.platform, "iOS"]
                      : formData.platform.filter(p => p !== "iOS");
                    setFormData({ ...formData, platform: newPlatform });
                  }}
                />
                <span style={{ color: "var(--spwn-text)" }}>iOS</span>
              </label>
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={!!formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <span style={{ color: "var(--spwn-text)" }}>Featured</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p style={{ color: "var(--spwn-faint)", fontSize: 12 }}>Minimum Specs</p>
              <input
                type="text"
                placeholder="OS"
                value={formData.minSpecs.os}
                onChange={(e) => setFormData({ ...formData, minSpecs: { ...formData.minSpecs, os: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
              <input
                type="text"
                placeholder="CPU"
                value={formData.minSpecs.cpu}
                onChange={(e) => setFormData({ ...formData, minSpecs: { ...formData.minSpecs, cpu: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
              <input
                type="text"
                placeholder="RAM"
                value={formData.minSpecs.ram}
                onChange={(e) => setFormData({ ...formData, minSpecs: { ...formData.minSpecs, ram: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
              <input
                type="text"
                placeholder="Storage"
                value={formData.minSpecs.storage}
                onChange={(e) => setFormData({ ...formData, minSpecs: { ...formData.minSpecs, storage: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
            </div>
            <div>
              <p style={{ color: "var(--spwn-faint)", fontSize: 12 }}>Recommended Specs</p>
              <input
                type="text"
                placeholder="OS"
                value={formData.recSpecs.os}
                onChange={(e) => setFormData({ ...formData, recSpecs: { ...formData.recSpecs, os: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
              <input
                type="text"
                placeholder="CPU"
                value={formData.recSpecs.cpu}
                onChange={(e) => setFormData({ ...formData, recSpecs: { ...formData.recSpecs, cpu: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
              <input
                type="text"
                placeholder="RAM"
                value={formData.recSpecs.ram}
                onChange={(e) => setFormData({ ...formData, recSpecs: { ...formData.recSpecs, ram: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
              <input
                type="text"
                placeholder="Storage"
                value={formData.recSpecs.storage}
                onChange={(e) => setFormData({ ...formData, recSpecs: { ...formData.recSpecs, storage: e.target.value } })}
                className="w-full px-3 py-2 rounded text-sm outline-none mt-1"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 px-3 py-2 rounded text-sm text-white"
              style={{ background: "var(--spwn-accent)", fontWeight: 600 }}
            >
              Create
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-2 rounded text-sm"
              style={{
                background: "var(--spwn-glass)",
                color: "var(--spwn-text)",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
