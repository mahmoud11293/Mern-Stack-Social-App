import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Notfound from "./Notfound/Notfound";
import UserContextProvider from "./Context/UserContext";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import ProtectedAuthRoutes from "./ProtectedRoute/ProtectedAuthRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PostDetails from "./Components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";
import { lazy, Suspense } from "react";
import Loader from "./Loader/Loader";
import ChangePassword from "./Components/Profile/ChangePassword";

const Home = lazy(() => import("./Components/Home/Home"));
const Profile = lazy(() => import("./Components/Profile/Profile"));

const query = new QueryClient();

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/changepassword",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedAuthRoutes>
            <Login />
          </ProtectedAuthRoutes>
        ),
      },
      {
        path: "/register",
        element: (
          <ProtectedAuthRoutes>
            <Register />
          </ProtectedAuthRoutes>
        ),
      },
      {
        path: "*",
        element: (
          <ProtectedRoute>
            <Notfound />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <UserContextProvider>
        <QueryClientProvider client={query}>
          <RouterProvider router={router} />
          <ToastContainer />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
