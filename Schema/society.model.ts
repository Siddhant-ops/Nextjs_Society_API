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
    users: {
      type: [userSchema],
      required: true,
    },
    referral: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("SocietySchema", societySchema, "Society");
