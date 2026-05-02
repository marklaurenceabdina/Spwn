import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import {
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Trophy,
  Tag,
  LogIn,
  Search,
  X,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Send,
  Check,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Comment {
  id: string;
  username: string;
  avatar: string;
  avatarColor: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  avatar: string;
  avatarColor: string;
  username: string;
  time: string;
  gameId: string | null;
  gameTag: string;
  gameTagColor: string;
  title: string;
  body: string;
  likes: number;
  comments: Comment[];
}

// ── Derived Data Helpers ───────────────────────────────────────────────────
const COLOR_PALETTE = [
  "#dc2626",
  "#059669",
  "#7c3aed",
  "#8b5cf6",
  "#0891b2",
  "#b45309",
  "#ff7a18",
  "#ff6363",
  "#00aaff",
  "#7f5af0",
];

function pickColorForName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i);
    h |= 0;
  }
  return COLOR_PALETTE[Math.abs(h) % COLOR_PALETTE.length];
}

function relativeTimeFromDate(dateStr?: string) {
  if (!dateStr) return "Just now";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day >= 7) return d.toLocaleDateString();
  if (day >= 1) return `${day}d ago`;
  if (hr >= 1) return `${hr}h ago`;
  if (min >= 1) return `${min}m ago`;
  return "Just now";
}

function mapReviewsToPosts(reviews: any[], games: any[]): Post[] {
  const byDate = [...reviews].sort((a, b) => {
    const da = new Date(a.date).getTime() || 0;
    const db = new Date(b.date).getTime() || 0;
    return db - da;
  });

  return byDate.map((r) => {
    const game = games.find((g) => g.id === r.gameId);
    return {
      id: `post_${r.id}`,
      avatar: r.username?.charAt(0)?.toUpperCase() || "?",
      avatarColor: pickColorForName(r.username || ""),
      username: r.username || "Unknown",
      time: relativeTimeFromDate(r.date),
      gameId: r.gameId ?? null,
      gameTag: game ? game.title : "General",
      gameTagColor: game ? pickColorForName(game.id) : "#0891b2",
      title: r.text && r.text.length > 0 ? r.text.slice(0, 80) : `Review of ${game?.title || "a game"}`,
      body: r.text || "",
      likes: r.helpful ?? 0,
      comments: [],
    } as Post;
  });
}

// ── Game Tag Picker ────────────────────────────────────────────────────────
function GameTagPicker({
  games,
  onSelect,
  onClose,
}: {
  games: any[];
  onSelect: (game: { id: string; title: string } | null) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return games;
    const q = query.toLowerCase();
    return games.filter((g) => g.title.toLowerCase().includes(q) || g.genres.some((gen: string) => gen.toLowerCase().includes(q)));
  }, [query, games]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl"
        style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)", maxWidth: 390 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-4" style={{ background: "var(--spwn-border-s)" }} />
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>Tag a Game</p>
            <button onClick={onClose} style={{ color: "var(--spwn-faint)" }}><X size={16} /></button>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)" }}>
            <Search size={13} style={{ color: "var(--spwn-faint)", flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games…"
              autoFocus
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--spwn-text)" }}
            />
            {query && <button onClick={() => setQuery("")}><X size={12} style={{ color: "var(--spwn-faint)" }} /></button>}
          </div>
          <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
            <button
              onClick={() => onSelect(null)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full"
              style={{ background: "var(--spwn-glass)", border: "1px solid var(--spwn-border)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--spwn-input)" }}>
                <Tag size={14} style={{ color: "var(--spwn-faint)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--spwn-muted)", fontWeight: 500 }}>No game tag (General)</p>
            </button>
            {filtered.map((game) => (
              <button
                key={game.id}
                onClick={() => onSelect({ id: game.id, title: game.title })}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full"
                style={{ background: "var(--spwn-glass)", border: "1px solid var(--spwn-border)" }}
              >
                <img src={game.image} alt={game.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--spwn-text)", fontWeight: 600 }}>{game.title}</p>
                  <p className="text-xs truncate" style={{ color: "var(--spwn-faint)" }}>{game.year} · {game.genres[0]}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-center py-6 text-sm" style={{ color: "var(--spwn-faint)" }}>No games found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Comments Sheet ─────────────────────────────────────────────────────────
function CommentsSheet({
  post,
  onClose,
  onAddComment,
  currentUser,
}: {
  post: Post;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
  currentUser: { username: string } | null;
}) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (!commentText.trim() || !currentUser) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl flex flex-col"
        style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)", maxWidth: 390, maxHeight: "75vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="shrink-0">
          <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-3" style={{ background: "var(--spwn-border-s)" }} />
          <div className="flex items-center justify-between px-4 pb-3" style={{ borderBottom: "1px solid var(--spwn-border)" }}>
            <p className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>
              Comments ({post.comments.length})
            </p>
            <button onClick={onClose} style={{ color: "var(--spwn-faint)" }}><X size={16} /></button>
          </div>
        </div>

        {/* Post preview */}
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--spwn-border)" }}>
          <p className="text-xs" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>{post.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--spwn-faint)" }}>by {post.username}</p>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {post.comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={24} style={{ color: "var(--spwn-fainter)", margin: "0 auto 8px" }} />
              <p className="text-sm" style={{ color: "var(--spwn-faint)" }}>No comments yet. Be the first!</p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 text-white"
                  style={{ background: comment.avatarColor, fontWeight: 700 }}
                >
                  {comment.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="px-3 py-2.5 rounded-2xl rounded-tl-sm"
                    style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)" }}
                  >
                    <p className="text-xs mb-1" style={{ color: "var(--spwn-accent)", fontWeight: 700 }}>{comment.username}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--spwn-text)" }}>{comment.text}</p>
                  </div>
                  <p className="text-xs mt-1 ml-1" style={{ color: "var(--spwn-fainter)" }}>{comment.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input */}
        <div className="shrink-0 px-4 py-3" style={{ borderTop: "1px solid var(--spwn-border)" }}>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 text-white"
                style={{ background: "linear-gradient(135deg, #6d28d9, #00aaff)", fontWeight: 700 }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full"
                style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)" }}
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Add a comment…"
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: "var(--spwn-text)" }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!commentText.trim()}
                  style={{ color: commentText.trim() ? "var(--spwn-accent)" : "var(--spwn-fainter)" }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-xs" style={{ color: "var(--spwn-faint)" }}>
              Sign in to leave a comment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────
function PostCard({
  post,
  liked,
  onLike,
  onComment,
  currentUser,
  onEdit,
  onDelete,
}: {
  post: Post;
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  currentUser: { username: string } | null;
  onEdit: (postId: string, title: string, body: string) => void;
  onDelete: (postId: string) => void;
}) {
  const navigate = useNavigate();
  const isOwn = currentUser?.username === post.username;
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);

  const handleSave = () => {
    if (!editTitle.trim() && !editBody.trim()) return;
    onEdit(post.id, editTitle.trim() || post.title, editBody.trim() || post.body);
    setEditing(false);
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 text-white"
            style={{ background: post.avatarColor, fontWeight: 700 }}
          >
            {post.avatar}
          </div>
          <div>
            <p className="text-xs" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>{post.username}</p>
            <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>{post.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Game tag */}
          {post.gameId ? (
            <button
              onClick={() => navigate(`/app/game/${post.gameId}`)}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${post.gameTagColor}20`, color: post.gameTagColor, border: `1px solid ${post.gameTagColor}40`, fontWeight: 600 }}
            >
              <GamepadIcon size={10} />
              {post.gameTag}
              <ChevronRight size={10} />
            </button>
          ) : (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${post.gameTagColor}20`, color: post.gameTagColor, border: `1px solid ${post.gameTagColor}40`, fontWeight: 600 }}
            >
              {post.gameTag}
            </span>
          )}

          {/* Own-post menu */}
          {isOwn && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-6 h-6 flex items-center justify-center rounded-lg"
                style={{ background: showMenu ? "var(--spwn-glass)" : "transparent", color: "var(--spwn-faint)" }}
              >
                <MoreHorizontal size={15} />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                  <div
                    className="absolute right-0 top-7 rounded-xl z-40 overflow-hidden"
                    style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)", minWidth: 130 }}
                  >
                    <button
                      onClick={() => { setEditing(true); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-left"
                      style={{ color: "var(--spwn-text)", fontWeight: 600 }}
                    >
                      <Pencil size={12} style={{ color: "var(--spwn-accent)" }} />
                      Edit Post
                    </button>
                    <div style={{ height: 1, background: "var(--spwn-border)" }} />
                    <button
                      onClick={() => { onDelete(post.id); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-left"
                      style={{ color: "#ef4444", fontWeight: 600 }}
                    >
                      <Trash2 size={12} />
                      Delete Post
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body — view or edit mode */}
      {editing ? (
        <div className="mb-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-2"
            style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)", fontWeight: 700 }}
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none mb-2"
            style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white"
              style={{ background: "var(--spwn-accent)", fontWeight: 700 }}
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={() => { setEditing(false); setEditTitle(post.title); setEditBody(post.body); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "var(--spwn-glass)", color: "var(--spwn-muted)", border: "1px solid var(--spwn-border)", fontWeight: 600 }}
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm mb-2" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>{post.title}</p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--spwn-muted)" }}>{post.body}</p>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2" style={{ borderTop: "1px solid var(--spwn-border)" }}>
        <button
          onClick={onLike}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: liked ? "var(--spwn-accent)" : "var(--spwn-faint)" }}
        >
          <ThumbsUp size={13} fill={liked ? "var(--spwn-accent)" : "none"} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button
          onClick={onComment}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: "var(--spwn-faint)" }}
        >
          <MessageCircle size={13} />
          {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function CommunityPage() {
  const navigate = useNavigate();
  const { user, reviews, games, getGameById } = useApp();
  const [postSubject, setPostSubject] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState<Post[]>(() => mapReviewsToPosts(reviews, games));
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const topContributors = useMemo(() => {
    const agg: Record<string, { username: string; points: number; reviews: number }> = {};
    reviews.forEach((r: any) => {
      const name = r.username || "Unknown";
      if (!agg[name]) agg[name] = { username: name, points: 0, reviews: 0 };
      agg[name].reviews += 1;
      agg[name].points += r.helpful ?? 0;
    });

    const arr = Object.values(agg).sort((a, b) => (b.points - a.points) || (b.reviews - a.reviews));

    return arr.slice(0, 5).map((c, i) => ({
      rank: i + 1,
      initials: c.username.slice(0, 2).toUpperCase(),
      avatarColor: pickColorForName(c.username),
      username: c.username,
      points: c.points || c.reviews * 10,
    }));
  }, [reviews]);
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{ id: string; title: string } | null>(null);
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);

  const trendingGames = [...games].sort((a, b) => b.popularity - a.popularity).slice(0, 4);

  const handlePost = () => {
    if (!postText.trim() || !user) return;
    const subject = postSubject.trim();
    const newPost: Post = {
      id: `p_${Date.now()}`,
      avatar: user.username.charAt(0).toUpperCase(),
      avatarColor: "#00aaff",
      username: user.username,
      time: "Just now",
      gameId: selectedGame?.id ?? null,
      gameTag: selectedGame?.title ?? "General",
      gameTagColor: selectedGame ? "#0891b2" : "#6b7280",
      title: subject || postText.trim().slice(0, 80),
      body: postText.trim(),
      likes: 0,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostSubject("");
    setPostText("");
    setSelectedGame(null);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      username: user.username,
      avatar: user.username.charAt(0).toUpperCase(),
      avatarColor: "#00aaff",
      text,
      time: "Just now",
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    // Also update activeCommentPost so the sheet reflects the new comment immediately
    setActiveCommentPost((prev) =>
      prev && prev.id === postId
        ? { ...prev, comments: [...prev.comments, newComment] }
        : prev
    );
  };

  const handleEditPost = (postId: string, title: string, body: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, title, body } : p))
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const openComments = (post: Post) => {
    // Get latest version of post from state
    const latest = posts.find((p) => p.id === post.id) ?? post;
    setActiveCommentPost(latest);
  };

  return (
    <div className="flex flex-col pb-6" style={{ background: "var(--spwn-bg)" }}>
      <div className="px-4 pt-4">
        <h1 className="text-xl mb-4" style={{ fontWeight: 800, color: "var(--spwn-text)" }}>
          Community Feed
        </h1>

        {/* ── Compose box ── */}
        {user ? (
          <div className="rounded-xl p-3 mb-4" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
            <div className="flex gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 text-white"
                style={{ background: "linear-gradient(135deg, #6d28d9, #00aaff)", fontWeight: 700 }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={postSubject}
                  onChange={(e) => setPostSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)", fontWeight: 700 }}
                />
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share a gaming experience, ask for advice…"
                  className="w-full bg-transparent text-sm outline-none resize-none"
                  style={{ color: "var(--spwn-text)" }}
                  rows={3}
                />
              </div>
            </div>

            {selectedGame && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2"
                style={{ background: "rgba(0,136,221,0.1)", border: "1px solid rgba(0,136,221,0.25)" }}
              >
                <Tag size={12} style={{ color: "var(--spwn-accent)" }} />
                <span className="text-xs flex-1" style={{ color: "var(--spwn-accent)", fontWeight: 600 }}>
                  {selectedGame.title}
                </span>
                <button onClick={() => setSelectedGame(null)}>
                  <X size={12} style={{ color: "var(--spwn-accent)" }} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--spwn-border)" }}>
              <button
                onClick={() => setShowGamePicker(true)}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: selectedGame ? "var(--spwn-accent)" : "var(--spwn-faint)", fontWeight: selectedGame ? 600 : 400 }}
              >
                <Tag size={13} />
                {selectedGame ? "Change Game" : "Tag a Game"}
              </button>
              <button
                onClick={handlePost}
                disabled={!postText.trim()}
                className="px-4 py-1.5 rounded-lg text-xs text-white"
                style={{
                  background: postText.trim() ? "var(--spwn-accent)" : "var(--spwn-glass)",
                  fontWeight: 700,
                  color: postText.trim() ? "white" : "var(--spwn-fainter)",
                }}
              >
                Post
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl mb-4 text-sm"
            style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)", color: "var(--spwn-faint)" }}
          >
            <LogIn size={14} />
            Sign in to post in the community
          </button>
        )}

        {/* ── Post list ── */}
        <div className="flex flex-col gap-3 mb-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={likedPosts.includes(post.id)}
              onLike={() => toggleLike(post.id)}
              onComment={() => openComments(post)}
              currentUser={user}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>

        {/* ── Trending Games ── */}
        <div className="rounded-xl p-4 mb-3" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={13} style={{ color: "var(--spwn-accent)" }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
              Trending Games
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {trendingGames.map((g) => (
              <button key={g.id} onClick={() => navigate(`/app/game/${g.id}`)} className="flex items-center gap-3 text-left">
                <img src={g.image} alt={g.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--spwn-text)", fontWeight: 600 }}>{g.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--spwn-faint)" }}>{g.reviewCount.toLocaleString()} reviews</p>
                </div>
                <ChevronRight size={13} style={{ color: "var(--spwn-fainter)" }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Top Contributors ── */}
        <div className="rounded-xl p-4" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={13} style={{ color: "var(--spwn-accent)" }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
              Top Contributors
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {topContributors.map((c) => (
              <div key={c.username} className="flex items-center gap-3">
                <span className="text-xs w-4" style={{ color: "var(--spwn-fainter)", fontWeight: 600 }}>{c.rank}</span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 text-white"
                  style={{ background: c.avatarColor, fontWeight: 700 }}
                >
                  {c.initials}
                </div>
                <span className="text-sm flex-1" style={{ color: "var(--spwn-text)", fontWeight: 600 }}>{c.username}</span>
                <span className="text-xs" style={{ color: "var(--spwn-muted)", fontWeight: 600 }}>{c.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showGamePicker && (
        <GameTagPicker
          games={games}
          onSelect={(game) => { setSelectedGame(game); setShowGamePicker(false); }}
          onClose={() => setShowGamePicker(false)}
        />
      )}

      {activeCommentPost && (
        <CommentsSheet
          post={activeCommentPost}
          onClose={() => setActiveCommentPost(null)}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}
    </div>
  );
}

// Inline Gamepad icon
function GamepadIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="15" cy="12" r="1" fill="currentColor" /><circle cx="17" cy="10" r="1" fill="currentColor" />
      <path d="M6 20l2-4h8l2 4" /><rect x="2" y="6" width="20" height="12" rx="4" />
    </svg>
  );
}
