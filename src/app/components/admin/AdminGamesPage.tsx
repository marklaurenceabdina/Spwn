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
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-all"
            style={{ background: "var(--spwn-accent)", fontWeight: 700 }}
          >
            <Plus size={16} />
            New Game
          </button>
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
                <img src={game.image} alt={game.title} className="w-12 h-12 rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: "var(--spwn-text)" }}>{game.title}</p>
                  <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>{game.developer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(editingId === game.id ? null : game.id)}
                    className="p-2 rounded transition-all"
                    style={{ background: "var(--spwn-glass)" }}
                  >
                    <Edit size={14} style={{ color: "var(--spwn-accent)" }} />
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game.id)}
                    className="p-2 rounded transition-all"
                    style={{ background: "var(--spwn-glass)" }}
                  >
                    <Trash2 size={14} style={{ color: "#ff6b6b" }} />
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === game.id ? null : game.id)}
                    className="p-2 rounded transition-all"
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
  const [image, setImage] = useState(game.image || "");
  const [tags, setTags] = useState((game.tags || []).join(", "));

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
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              onSave({
                title,
                year: parseInt(year),
                rating: parseFloat(rating),
                description,
                image,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
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
  const [formData, setFormData] = useState({
    title: "",
    developer: "",
    publisher: "",
    year: new Date().getFullYear(),
    genres: ["Action"],
    description: "",
    longDescription: "",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 8,
    reviewCount: 0,
    tags: [],
    platform: ["PC"],
    minSpecs: {
      os: "Windows 10 64-bit",
      cpu: "Intel Core i5",
      ram: "8 GB",
      gpu: "NVIDIA GTX 960",
      storage: "30 GB",
    },
    recSpecs: {
      os: "Windows 10 64-bit",
      cpu: "Intel Core i7",
      ram: "16 GB",
      gpu: "NVIDIA GTX 1060",
      storage: "30 GB SSD",
    },
    trailerVideoId: "",
    popularity: 50,
  });
  const [tagsString, setTagsString] = useState((formData.tags || []).join(", "));

  const handleSubmit = () => {
    if (!formData.title || !formData.developer) {
      alert("Please fill in title and developer");
      return;
    }
    const payload = {
      ...formData,
      tags: tagsString.split(",").map((t) => t.trim()).filter(Boolean),
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
