import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/Navigation";
import { Spinner, Container } from "react-bootstrap";
import { setToken, setUser } from "./features/authSlice";

// Lazy load routes for code splitting
const UserList = lazy(() => import("./components/UserList"));
const SignIn = lazy(() => import("./SignIn"));
const LoginSuccess = lazy(() => import("./LoginSuccess"));
const UserPosts = lazy(() => import("./components/UserPosts"));
const UserManagement = lazy(() => import("./components/UserManagement"));
const PostCreation = lazy(() => import("./components/PostCreation"));

const LoadingSpinner = () => (
  <Container
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh" }}
  >
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>
);

// Component to restore auth state from localStorage on app load
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth state from localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      dispatch(setToken(savedToken));
    }

    if (savedUser) {
      try {
        dispatch(setUser(JSON.parse(savedUser)));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
  }, [dispatch]);

  return (
    <>
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/loginSuccess" element={<LoginSuccess />} />
          <Route path="/posts" element={<UserPosts />} />
          <Route path="/manage-users" element={<UserManagement />} />
          <Route path="/create-post" element={<PostCreation />} />
          <Route
            path="/"
            element={
              <div className="App">
                <SignIn />
                <UserList />
              </div>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
