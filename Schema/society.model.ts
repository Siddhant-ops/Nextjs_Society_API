import { Schema, model } from "mongoose";
import { userSchema } from "./User.model";

const societySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    users: [userSchema],
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    referral: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("SocietySchema", societySchema, "Society");
