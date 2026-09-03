"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [profs, setProfs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/professors`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProfs(list);

        Promise.all(
          list.map((prof) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${prof.id}`)
              .then((res) => res.json())
              .then((reviews) => {
                const revs = Array.isArray(reviews) ? reviews : [];
                const avg =
                  revs.length > 0
                    ? (revs.reduce((sum, r) => sum + r.rating, 0) / revs.length).toFixed(1)
                    : null;
                return { id: prof.id, avg };
              })
              .catch(() => ({ id: prof.id, avg: null }))
          )
        ).then((results) => {
          setProfs((prev) =>
            prev.map((prof) => {
              const match = results.find((r) => r.id === prof.id);
              return match ? { ...prof, rating: match.avg } : prof;
            })
          );
        });
      })
      .catch((err) => console.error(err));
  }, []);

  
  const filtered = (Array.isArray(profs) ? profs : []).filter((prof) =>
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
          <Link href={`/professor/${prof.id}`} key={prof.id}>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "12px",
                background: "#111",
                color: "white",
                cursor: "pointer"
              }}
            >
            <h2>{prof.name}</h2>
            <p>{prof.department}</p>
            {prof.rating != null && <p>⭐ {prof.rating}</p>}
          </div>
          </Link>
          ))
        )}
      </div>
    </div>
  );
}
