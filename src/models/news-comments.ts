import { InferSchemaType, model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    newsId: { type: Schema.Types.ObjectId, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

type Comment = InferSchemaType<typeof commentSchema>;

export default model<Comment>("Comment", commentSchema);
