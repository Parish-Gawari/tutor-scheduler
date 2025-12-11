import mongoose, { Schema } from "mongoose";

const SessionSchema = new Schema(
  {
    title: { type: String, required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    notes: { type: String },
    resourceIds: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
  },
  { timestamps: true },
);

export const Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);
