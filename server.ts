import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI: string = process.env.MONGODB_URI!;

mongoose
  .connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((mongoRes) => {
    const DBname = mongoRes.connections[0].name;
    console.log(`Mongoose connected to DB : ${DBname}`);
  })
  .catch((err) => console.error(err));

import auth from "./Routes/Auth/auth";

app.use("/api/auth", auth);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
});
