"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [profs, setProfs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/professors`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProfs(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });

    if (error) {
      console.error(error);
      alert("Something went wrong signing in");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Something went wrong signing out");
    }
  };


  const filtered = (Array.isArray(profs) ? profs : []).filter((prof) =>
    (prof.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (prof.department?.toLowerCase() || "").includes(search.toLowerCase())
  ); 

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "40px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {authLoading ? null : user ? (
          <>
            <span>{user.email}</span>
            <button
              onClick={handleSignOut}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        )}
      </div>

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
        {loading ? null : filtered.length === 0 ? (
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
            {prof.avg_rating != null && <p>⭐ {prof.avg_rating.toFixed(1)}</p>}
          </div>
          </Link>
          ))
        )}
      </div>
    </div>
  );
}
