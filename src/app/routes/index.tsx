import { lazy, Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { RequireAuth, RequireGuest } from "@/app/routes/guards";
import { RootLayout } from "@/app/layouts/RootLayout";
import { Loading } from "@/shared/components/Loading";

const Login = lazy(() => import("@/features/auth/pages/Login"));
const Dashboard = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const PostListPage = lazy(() => import("@/features/posts/pages/PostListPage"));
const PostEditPage = lazy(() => import("@/features/posts/pages/PostEditPage"));
const CategoryListPage = lazy(() => import("@/features/categories/pages/CategoryListPage"));
const CommentListPage = lazy(() => import("@/features/comments/pages/CommentListPage"));
const UserListPage = lazy(() => import("@/features/users/pages/UserListPage"));
const SettingsPage = lazy(() => import("@/features/users/pages/SettingsPage"));

export const router = createBrowserRouter([
  // 로그인
  {
    element: (
      <Suspense fallback={<Loading />}>
        <RequireGuest />
      </Suspense>
    ),
    children: [{ path: '/login', element: <Login /> }]
  },

  // 인증
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          {
            path: "posts",
            children: [
              { index: true, element: <PostListPage /> },
              { path: ":postId/edit", element: <PostEditPage /> }
            ]
          },
          {
            path: "categories",
            children: [
              { index: true, element: <CategoryListPage /> },
            ]
          },
          {
            path: "comments",
            children: [
              { index: true, element: <CommentListPage /> }
            ]
          },
          {
            path: "users",
            children: [
              { index: true, element: <UserListPage /> }
            ]
          },
          {
            path: "settings",
            element: <SettingsPage />
          }
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/dashboard" replace /> }
]);