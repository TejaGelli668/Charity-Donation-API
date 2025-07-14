import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.SERVER_PORT;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () =>
      console.log(`Server Started : http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.log(error));
