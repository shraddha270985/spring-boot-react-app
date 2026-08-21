import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { setToken, setUser } from "./features/authSlice";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

export default function LoginSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token) {
      dispatch(setToken(token));
      localStorage.setItem("token", token);

      if (email) {
        fetch(
          `${BACKEND_URL}/api/users/byEmail?email=${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("User not found");
            }
            return response.json();
          })
          .then((user) => {
            dispatch(setUser(user));
            localStorage.setItem("user", JSON.stringify(user));
            setLoading(false);
            setTimeout(() => navigate("/"), 1000);
          })
          .catch(() => {
            const fallbackUser = { email };
            dispatch(setUser(fallbackUser));
            localStorage.setItem("user", JSON.stringify(fallbackUser));
            setLoading(false);
            setTimeout(() => navigate("/"), 1000);
          });
      } else {
        setLoading(false);
        setTimeout(() => navigate("/"), 1000);
      }
    } else {
      navigate("/");
    }
  }, [searchParams, dispatch, navigate]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h2>Logging you in...</h2>
          <p className="text-muted">Redirecting to dashboard...</p>
        </div>
      </Container>
    );
  }

  return null;
}
