import React, { useEffect, useState } from "react";

const Heatmap = () => {
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    // Force iframe to refresh if the heatmap updates
    setIframeKey((prev) => prev + 1);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1E1E1E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          color: "#FFF",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        High-demand Zones
      </h2>

      <iframe
        key={iframeKey} // This forces reload
        src="/heatmap.html"
        title="Heatmap"
        style={{
          width: "80vw",
          height: "70vh",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.4)",
        }}
      />
    </div>
  );
};

export default Heatmap;
