import { Schema, model } from "mongoose";

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    societyName: {
      type: [String],
    },
    societyId: {
      type: [Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  }
);

export default model("UserSchema", userSchema, "Users");
