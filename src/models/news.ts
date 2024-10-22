import { InferSchemaType, model, Schema } from "mongoose";

const newsSchema = new Schema(
  {
    createdBy: { type: String, required: true },
    editedBy: { type: String, require: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["politics", "sports", "health", "business", "travel"],
      required: true,
    },
    status: { type: String, enum: ["published", "drafted"], required: true },
  },
  { timestamps: true }
);

type News = InferSchemaType<typeof newsSchema>;

export default model<News>("News", newsSchema);
