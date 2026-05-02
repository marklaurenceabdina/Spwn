import { createBrowserRouter } from "react-router";
import { AuthPage } from "./components/auth/AuthPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { MobileLayout } from "./components/layout/MobileLayout";
import { HomePage } from "./components/home/HomePage";
import { DiscoverPage } from "./components/discover/DiscoverPage";
import { GamesPage } from "./components/games/GamesPage";
import { GameDetailPage } from "./components/games/GameDetailPage";
import { CommunityPage } from "./components/community/CommunityPage";
import { WishlistPage } from "./components/wishlist/WishlistPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { MyReviewsPage } from "./components/profile/MyReviewsPage";
import { PrivacySecurityPage } from "./components/security/PrivacySecurityPage";
import { HelpSupportPage } from "./components/support/HelpSupportPage";
import { AdminGamesPage } from "./components/admin/AdminGamesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/app",
    Component: MobileLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "discover", Component: DiscoverPage },
      { path: "games", Component: GamesPage },
      { path: "game/:id", Component: GameDetailPage },
      { path: "community", Component: CommunityPage },
      { path: "wishlist", Component: WishlistPage },
      { path: "profile", Component: ProfilePage },
      { path: "my-reviews", Component: MyReviewsPage },
      { path: "privacy-security", Component: PrivacySecurityPage },
      { path: "help-support", Component: HelpSupportPage },
      { path: "admin/games", Component: AdminGamesPage },
    ],
  },
]);
