"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProfessorPage() {
  const [prof, setProf] = useState(null);
  const params = useParams();

  useEffect(() => {
    fetch(`http://localhost:5001/professors/${params.id}`)
      .then(res => res.json())
      .then(data => setProf(data));
  }, [params.id]);

  if (!prof) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>{prof.name}</h1>
      <p>{prof.department}</p>
      <p>⭐ {prof.rating ?? "N/A"}</p>
    </div>
  );
}