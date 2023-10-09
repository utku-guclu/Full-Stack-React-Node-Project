import express from 'express'
import cors from 'cors'

const PORT: number = 4000;

const app = express();

app.use(express.json())
app.use(cors())

app.get("/api/notes", async(req, res) => {
  res.json({message: "success!"})
})  

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`)
})