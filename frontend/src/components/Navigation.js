import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        backgroundColor: "#222",
        color: "white",
        padding: "10px 20px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        📱 Demo App
      </Link>

      <Link
        to="/"
        style={{
          color: isActive("/") ? "#0d6efd" : "white",
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        👥 Users
      </Link>

      <Link
        to="/posts"
        style={{
          color: isActive("/posts") ? "#0d6efd" : "white",
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        📝 Posts
      </Link>

      {user?.role === "ADMIN" && (
        <Link
          to="/manage-users"
          style={{
            color: isActive("/manage-users") ? "#0d6efd" : "white",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ⚙️ Manage
        </Link>
      )}

      {user?.name && (
        <span style={{ marginLeft: "auto", fontSize: "14px" }}>
          👤 {user.name}
        </span>
      )}
    </div>
  );
};

export default Navigation;
