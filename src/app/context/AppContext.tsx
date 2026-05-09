import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SEED_REVIEWS, GAMES as INITIAL_GAMES, Game } from "../data/games";
import { hashPassword, verifyPassword } from "../utils/auth";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  profileVisibility?: "public" | "private";
  reviewPrivacy?: "public" | "private";
}

export interface Review {
  id: string;
  gameId: string;
  username: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

export type BacklogStatus = "want" | "playing" | "finished";
export type Backlog = Record<string, BacklogStatus>;

export interface AuthError {
  message: string;
}

interface AppState {
  user: User | null;
  darkMode: boolean;
  backlog: Backlog;
  wishlist: Set<string>;
  reviews: Review[];
  userRatings: Record<string, number>;
  games: Game[];
  toggleDarkMode: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addToBacklog: (gameId: string, status: BacklogStatus) => void;
  removeFromBacklog: (gameId: string) => void;
  getBacklogStatus: (gameId: string) => BacklogStatus | null;
  isInBacklog: (gameId: string) => boolean;
  addToWishlist: (gameId: string) => void;
  removeFromWishlist: (gameId: string) => void;
  isInWishlist: (gameId: string) => boolean;
  addReview: (gameId: string, rating: number, text: string) => void;
  editReview: (reviewId: string, rating: number, text: string) => void;
  getReviewsForGame: (gameId: string) => Review[];
  hasReviewedGame: (gameId: string) => boolean;
  setUserRating: (gameId: string, rating: number) => void;
  getUserRating: (gameId: string) => number;
  createGame: (game: Omit<Game, "id">) => void;
  updateGame: (gameId: string, game: Partial<Game>) => void;
  deleteGame: (gameId: string) => void;
  getGameById: (gameId: string) => Game | undefined;
  // Account management
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  setTwoFactorEnabled: (enabled: boolean) => Promise<{ success: boolean; secret?: string; error?: string }>;
  getUserSettings: () => { twoFactorEnabled: boolean; profileVisibility: "public" | "private"; reviewPrivacy: "public" | "private" } | null;
  getReviewPrivacyByUsername: (username: string) => "public" | "private";
  getVisibleReviewsForGame: (gameId: string) => Review[];
  setProfileVisibility: (visibility: "public" | "private") => void;
  setReviewPrivacy: (privacy: "public" | "private") => void;
  exportUserData: () => void;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppState | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

/**
 * Initialize predefined admin account
 */
async function initializeAdminAccount() {
  const users = loadFromStorage<StoredUser[]>("spwn_users", []);
  const adminExists = users.some((u) => u.email === "admin@spwn.dev");

  if (!adminExists) {
    const adminHash = await hashPassword("admin123");
    const adminUser: StoredUser = {
      id: `user_${Date.now()}`,
      username: "Admin",
      email: "admin@spwn.dev",
      passwordHash: adminHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    users.push(adminUser);
    saveToStorage("spwn_users", users);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage("spwn_user", null));
  const [darkMode, setDarkMode] = useState<boolean>(() => loadFromStorage("spwn_dark", true));
  const [backlog, setBacklog] = useState<Backlog>(() => loadFromStorage("spwn_backlog", {}));
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    const stored = loadFromStorage<string[]>("spwn_wishlist", []);
    return new Set(stored);
  });
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage("spwn_reviews", SEED_REVIEWS));
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => loadFromStorage("spwn_ratings", {}));
  const [games, setGames] = useState<Game[]>(() => loadFromStorage("spwn_games", INITIAL_GAMES));

  // Initialize admin account on first load
  useEffect(() => {
    initializeAdminAccount();
  }, []);

  // Migrate any legacy profileVisibility values ("friends") to "private"
  useEffect(() => {
    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    let changed = false;
    for (const u of users) {
      if ((u as any).profileVisibility === "friends") {
        (u as any).profileVisibility = "private";
        changed = true;
      }
    }
    if (changed) saveToStorage("spwn_users", users);
  }, []);

  useEffect(() => saveToStorage("spwn_user", user), [user]);
  useEffect(() => saveToStorage("spwn_dark", darkMode), [darkMode]);
  useEffect(() => saveToStorage("spwn_backlog", backlog), [backlog]);
  useEffect(() => saveToStorage("spwn_wishlist", Array.from(wishlist)), [wishlist]);
  useEffect(() => saveToStorage("spwn_reviews", reviews), [reviews]);
  useEffect(() => saveToStorage("spwn_ratings", userRatings), [userRatings]);
  useEffect(() => saveToStorage("spwn_games", games), [games]);

  // Update game ratings based on reviews
  useEffect(() => {
    setGames((prevGames) =>
      prevGames.map((game) => {
        // ✅ ignore default 0-star reviews
        const gameReviews = reviews.filter(
          (r) => r.gameId === game.id && r.rating > 0
        );

        // ✅ if no valid reviews, reset rating/review count
        if (!gameReviews.length) {
          if (game.rating === 0 && game.reviewCount === 0) {
            return game;
          }

          return {
            ...game,
            rating: 0,
            reviewCount: 0,
          };
        }

        const avg =
          gameReviews.reduce((sum, r) => sum + r.rating, 0) /
          gameReviews.length;

        const newRating = Math.round(avg * 10) / 10;

        // ✅ prevent unnecessary re-render
        if (
          game.rating === newRating &&
          game.reviewCount === gameReviews.length
        ) {
          return game;
        }

        return {
          ...game,
          rating: newRating,
          reviewCount: gameReviews.length,
        };
      })
    );
  }, [reviews]);

  // Migrate legacy global featured id into per-game `featured` flag
  useEffect(() => {
    const legacy = loadFromStorage<string | null>("spwn_featured", null);
    if (legacy) {
      setGames((prev) => {
        const next = prev.map((g) => ({ ...g, featured: g.id === legacy }));
        saveToStorage("spwn_games", next);
        try { localStorage.removeItem("spwn_featured"); } catch { }
        return next;
      });
    }
  }, []);

  // persist users storage when it changes via helper functions below

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  /**
   * Secure login with password verification
   */
  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    const storedUser = users.find((u) => u.email === email);

    if (!storedUser) {
      return { success: false, error: "Invalid email or password" };
    }

    try {
      const isPasswordValid = await verifyPassword(password, storedUser.passwordHash);

      if (!isPasswordValid) {
        return { success: false, error: "Invalid email or password" };
      }

      const sessionUser: User = {
        id: storedUser.id,
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role,
      };

      setUser(sessionUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Authentication failed. Please try again." };
    }
  }

  /**
   * Change the current user's password after verifying the current password.
   */
  async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!user) return { success: false, error: "Not authenticated" };
    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    const stored = users.find((u) => u.email === user.email);
    if (!stored) return { success: false, error: "User not found" };
    try {
      const ok = await verifyPassword(currentPassword, stored.passwordHash);
      if (!ok) return { success: false, error: "Current password is incorrect" };
      const newHash = await hashPassword(newPassword);
      stored.passwordHash = newHash;
      saveToStorage("spwn_users", users);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to update password" };
    }
  }

  /**
   * Secure signup with password hashing
   */
  async function signup(username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!username || !email || !password) {
      return { success: false, error: "All fields are required" };
    }

    const users = loadFromStorage<StoredUser[]>("spwn_users", []);

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return { success: false, error: "Email is already registered" };
    }

    // Check if username is already taken
    if (users.some((u) => u.username === username)) {
      return { success: false, error: "Username is already taken" };
    }

    try {
      const passwordHash = await hashPassword(password);

      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        passwordHash,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveToStorage("spwn_users", users);

      const sessionUser: User = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      };

      setUser(sessionUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to create account. Please try again." };
    }
  }

  /**
   * Enable/disable a simple two-factor flag and optionally return a secret when enabling.
   */
  async function setTwoFactorEnabled(enabled: boolean): Promise<{ success: boolean; secret?: string; error?: string }> {
    if (!user) return { success: false, error: "Not authenticated" };
    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    const stored = users.find((u) => u.email === user.email);
    if (!stored) return { success: false, error: "User not found" };
    if (enabled) {
      // generate a simple secret (hex) for demonstration
      const arr = new Uint8Array(10);
      crypto.getRandomValues(arr);
      const secret = Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
      stored.twoFactorEnabled = true;
      stored.twoFactorSecret = secret;
      saveToStorage("spwn_users", users);
      return { success: true, secret };
    } else {
      stored.twoFactorEnabled = false;
      delete stored.twoFactorSecret;
      saveToStorage("spwn_users", users);
      return { success: true };
    }
  }

  function getUserSettings() {
    if (!user) return null;
    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    const stored = users.find((u) => u.email === user.email);
    if (!stored) return null;
    return {
      twoFactorEnabled: !!stored.twoFactorEnabled,
      profileVisibility: (stored as any).profileVisibility === "friends" ? "private" : stored.profileVisibility || "public",
      reviewPrivacy: stored.reviewPrivacy || "public",
    };
  }

  function getReviewPrivacyByUsername(username: string): "public" | "private" {
    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    const stored = users.find((u) => u.username === username);
    if (!stored) return "public";
    return stored.reviewPrivacy || "public";
  }

  // Featured is now stored per-game; use `updateGame` to set `featured`.

  function setProfileVisibility(visibility: "public" | "private") {
    if (!user) return;
    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    const stored = users.find((u) => u.email === user.email);
    if (!stored) return;
    stored.profileVisibility = visibility;
    saveToStorage("spwn_users", users);
  }

  function setReviewPrivacy(privacy: "public" | "private") {
    if (!user) return;
    const users = loadFromStorage<StoredUser[]>("spwn_users", []);
    const stored = users.find((u) => u.email === user.email);
    if (!stored) return;
    stored.reviewPrivacy = privacy;
    saveToStorage("spwn_users", users);
  }

  function exportUserData() {
    if (!user) return;
    const userReviews = reviews.filter((r) => r.username === user.username);
    const data = {
      user,
      reviews: userReviews,
      games,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spwn-data-${user.username}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
    if (!user) return { success: false, error: "Not authenticated" };
    try {
      const users = loadFromStorage<StoredUser[]>("spwn_users", []);
      const remaining = users.filter((u) => u.email !== user.email);
      saveToStorage("spwn_users", remaining);

      // remove user's reviews
      setReviews((prev) => prev.filter((r) => r.username !== user.username));

      // sign out
      setUser(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete account" };
    }
  }

  function logout() {
    setUser(null);
  }

  function addToBacklog(gameId: string, status: BacklogStatus) {
    setBacklog((prev) => ({ ...prev, [gameId]: status }));
  }

  function removeFromBacklog(gameId: string) {
    setBacklog((prev) => {
      const next = { ...prev };
      delete next[gameId];
      return next;
    });
  }

  function getBacklogStatus(gameId: string): BacklogStatus | null {
    return backlog[gameId] ?? null;
  }

  function isInBacklog(gameId: string): boolean {
    return gameId in backlog;
  }

  function addToWishlist(gameId: string) {
    setWishlist((prev) => new Set([...prev, gameId]));
  }

  function removeFromWishlist(gameId: string) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.delete(gameId);
      return next;
    });
  }

  function isInWishlist(gameId: string): boolean {
    return wishlist.has(gameId);
  }

  function addReview(gameId: string, rating: number, text: string) {
    if (!user) return;
    const newReview: Review = {
      id: `r_${Date.now()}`,
      gameId,
      username: user.username,
      rating,
      text,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setUserRatings((prev) => ({ ...prev, [gameId]: rating }));
  }

  function editReview(reviewId: string, rating: number, text: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, rating, text, date: new Date().toISOString().split("T")[0] }
          : r
      )
    );
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      setUserRatings((prev) => ({ ...prev, [review.gameId]: rating }));
    }
  }

  function getReviewsForGame(gameId: string) {
    // Return ALL reviews for this game so stars count toward average
    return reviews.filter((r) => r.gameId === gameId && r.rating > 0);
  }

  function getVisibleReviewsForGame(gameId: string) {
    // Return only publicly viewable review text (not ratings)
    return reviews.filter((r) => {
      // Only return reviews for this game
      if (r.gameId !== gameId) return false;

      // Only show reviews with rating > 0
      if (r.rating <= 0) return false;

      // Get the reviewer's privacy setting
      const reviewerPrivacy = getReviewPrivacyByUsername(r.username);

      // If review is public, show it to everyone
      if (reviewerPrivacy === "public") return true;

      // If review is private, only show it to the reviewer themselves
      if (reviewerPrivacy === "private" && user && r.username === user.username) return true;

      // Otherwise, don't show the private review
      return false;
    });
  }

  function hasReviewedGame(gameId: string) {
    if (!user) return false;
    return reviews.some((r) => r.gameId === gameId && r.username === user.username);
  }

  function setUserRating(gameId: string, rating: number) {
    setUserRatings((prev) => ({ ...prev, [gameId]: rating }));
  }

  function getUserRating(gameId: string) {
    return userRatings[gameId] ?? 0;
  }

  function createGame(gameData: Omit<Game, "id">) {
    const newGame: Game = {
      ...gameData,
      id: `game_${Date.now()}`,
    };
    setGames((prev) => [newGame, ...prev]);
  }

  function updateGame(gameId: string, gameData: Partial<Game>) {
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId ? { ...g, ...gameData } : g
      )
    );
  }

  function deleteGame(gameId: string) {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  }

  function getGameById(gameId: string): Game | undefined {
    return games.find((g) => g.id === gameId);
  }

  return (
    <AppContext.Provider
      value={{
        user,
        darkMode,
        backlog,
        wishlist,
        reviews,
        userRatings,
        games,
        toggleDarkMode,
        login,
        signup,
        logout,
        addToBacklog,
        removeFromBacklog,
        getBacklogStatus,
        isInBacklog,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addReview,
        editReview,
        getReviewsForGame,
        hasReviewedGame,
        setUserRating,
        getUserRating,
        createGame,
        updateGame,
        deleteGame,
        getGameById,
        changePassword,
        setTwoFactorEnabled,
        getUserSettings,
        getReviewPrivacyByUsername,
        getVisibleReviewsForGame,
        setProfileVisibility,
        setReviewPrivacy,
        exportUserData,
        deleteAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}