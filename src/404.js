import React from "react";
import "./index.css";

const NotFound = () => {
  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "1rem", maxWidth: "90%" }}>
        The page you were looking for could not be found. It might have been deleted or moved.
      </h2>
      <img
        src={`${process.env.PUBLIC_URL}/404alt.gif`}
        alt="404 Not Found"
        style={{
          maxWidth: "100%",
          maxHeight: "300px",
          objectFit: "contain",
          marginBottom: "1rem",
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = "none";
        }}
      />
      <h3 style={{ margin: 0 }}>404 Not Found</h3>
    </div>
  );
};

export default NotFound;
