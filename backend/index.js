const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');

console.log("STARTING SERVER...");

const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(5001, () => {
  console.log('Server running on port 5001');
});

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