require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');

console.log("STARTING SERVER...");

const app = express();

app.use(cors());
app.use(express.json());

/* GET ALL PROFESSORS */
app.get('/professors', async (req, res) => {
  console.log("HIT /professors");

  const { data, error } = await supabase
    .from('professors')
    .select('*');

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});


/* GET SINGLE PROFESSOR BY ID */
app.get("/professors/:id", async (req, res) => {
  const { id } = req.params;

  console.log("HIT /professors/:id", id);

  const { data, error } = await supabase
    .from("professors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ error });
  }

  res.json(data);
});

/* VERIFY SUPABASE SESSION + FLAME EMAIL */
function formatReviewerName(rawName) {
  const trimmed = (rawName || "").trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : null;

  const formatted = lastInitial ? `${first} ${lastInitial}.` : first;
  return formatted.slice(0, 40);
}

async function requireFlameAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    console.error("Auth check failed");
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const email = data.user.email?.toLowerCase() || "";
  if (!email.endsWith("@flame.edu.in")) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const googleIdentity = data.user.identities?.find((i) => i.provider === "google");
  const rawName =
    googleIdentity?.identity_data?.full_name ||
    googleIdentity?.identity_data?.name ||
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.name ||
    null;

  req.verifiedUser = {
    id: data.user.id,
    email: data.user.email,
    reviewerName: formatReviewerName(rawName),
  };
  next();
}

/* ADD A REVIEW */
app.post("/reviews", requireFlameAuth, async (req, res) => {
  console.log("HIT POST /reviews");
  console.log("BODY:", req.body);

  const { professor_id, rating, comment } = req.body;

  if (!professor_id || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("simple_reviews")
    .insert([
      {
        professor_id,
        rating,
        comment,
        user_id: req.verifiedUser.id,
        user_email: req.verifiedUser.email,
        reviewer_name: req.verifiedUser.reviewerName,
      },
    ]);

  if (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error });
  }

  res.json({ message: "Review added", data });
});

/* GET REVIEWS FOR A PROFESSOR */
app.get("/reviews/:professor_id", async (req, res) => {
  const { professor_id } = req.params;

  console.log("HIT GET /reviews/:professor_id", professor_id);

  const { data, error } = await supabase
    .from("simple_reviews")
    .select("id, professor_id, rating, comment, created_at, reviewer_name")
    .eq("professor_id", professor_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error });
  }

  res.json(data);
});



app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('Server running on port ' + PORT));