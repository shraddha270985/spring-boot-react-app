import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { setToken, setUser, signOut } from "./features/authSlice";
import { clearUsers } from "./features/usersSlice";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:8080");

export default function SignIn() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      dispatch(setToken(storedToken));
    }

    if (storedUser) {
      try {
        dispatch(setUser(JSON.parse(storedUser)));
      } catch (error) {
        console.warn("Failed to parse stored user", error);
      }
    }
  }, [dispatch]);

  const handleSignIn = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(clearUsers());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center py-5">
              {token && user ? (
                <>
                  <Card.Title className="mb-4">Welcome!</Card.Title>
                  <p className="mb-4">
                    Signed in as <strong>{user.name || user.email}</strong>
                  </p>
                  <Button
                    variant="danger"
                    onClick={handleSignOut}
                    className="w-100"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Card.Title className="mb-4">Sign In</Card.Title>
                  <p className="text-muted mb-4">
                    Sign in with your Google account to manage users.
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleSignIn}
                    className="w-100"
                    size="lg"
                  >
                    Sign in with Google
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
