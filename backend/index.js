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

/* ADD A REVIEW */
app.post("/reviews", async (req, res) => {
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
    .select("*")
    .eq("professor_id", professor_id);

  if (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error });
  }

  res.json(data);
});



app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(5001, () => {
  console.log('Server running on port 5001');
});