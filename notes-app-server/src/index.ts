import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const PORT: number = 4000;

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
  // fetch data (prizma)
  const notes = await prisma.note.findMany();

  // res.json({message: "success!"})
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  // send a response with satatus 400 (BAD REQUEST) or proceed
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    // INTERNAL SERVER ERROR
    res.status(500).send("Oops..something went wrong!");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number!");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("oops, something went wrong!");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if(!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number!")
  }

  try {
    await prisma.note.delete({
      where: {id}
    })
    res.status(204).send(); // NO CONTENT
  } catch (error) {
    res.status(500).send("oops, something went wrong :/")
  }

})

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
