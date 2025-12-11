import mongoose, { Schema } from "mongoose";

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Resource =
  mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
