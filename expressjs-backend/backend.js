const express = require("express");
const app = express();
const port = 8000;
const uuid = require("uuid");
const cors = require("cors");

app.use(cors());

app.use(express.json());

const entries = {
  entry_list: [
    {
      id: 'xyz123',
      title: "Untitled",
      description: "No Description.",
      price: "0",
    },
  ],
};

app.get("/listings", (req, res) => {
  res.send(entries);
});

app.post("/listings", (req, res) => {
  const entryToAdd = req.body;
  entryToAdd["id"] = gen_random_id();
  addEntry(entryToAdd);
  res.status(201).send(entryToAdd);
});

function addEntry(entry) {
  entries["entry_list"].push(entry);
}

function gen_random_id() {
  const random_id = uuid.v4();
  return random_id;
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
