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

  useEffect(() => saveToStorage("spwn_user", user), [user]);
  useEffect(() => saveToStorage("spwn_dark", darkMode), [darkMode]);
  useEffect(() => saveToStorage("spwn_backlog", backlog), [backlog]);
  useEffect(() => saveToStorage("spwn_wishlist", Array.from(wishlist)), [wishlist]);
  useEffect(() => saveToStorage("spwn_reviews", reviews), [reviews]);
  useEffect(() => saveToStorage("spwn_ratings", userRatings), [userRatings]);
  useEffect(() => saveToStorage("spwn_games", games), [games]);

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
    return reviews.filter((r) => r.gameId === gameId);
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
