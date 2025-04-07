import React from 'react';
import './index.css';

const ServerErrorPage = () => {
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
        Something went wrong on our end. Please try again later.
      </h2>
      <img
        src={`${process.env.PUBLIC_URL}/404alt.gif`}
        alt="500 Server Error"
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
      <h3 style={{ margin: 0 }}>500 Server Error</h3>
    </div>
  );
};
export default ServerErrorPage;
