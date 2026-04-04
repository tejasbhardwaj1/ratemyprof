"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [profs, setProfs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/professors")
      .then((res) => res.json())
      .then((data) => setProfs(data))
      .catch((err) => console.error(err));
  }, []);

  
  const filtered = profs.filter((prof) =>
    (prof.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (prof.department?.toLowerCase() || "").includes(search.toLowerCase())
  ); 

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Find Your Professors
      </h1>

      <input
        type="text"
        placeholder="Search professors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          borderRadius: "8px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filtered.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No professors found</p>
        ) : (
          filtered.map((prof) => (
          <div
            key={prof.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "12px",
              background: "#111",
              color: "white",
            }}
          >
            <h2>{prof.name}</h2>
            <p>{prof.department}</p>
            <p>⭐ {prof.rating ?? "N/A"}</p>
          </div>
        )))}
      </div>
    </div>
  );
}
