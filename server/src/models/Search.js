import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    searchedAt: {
      type: Date,
      default: Date.now
    },
    count: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Search || mongoose.model("Search", searchSchema);
