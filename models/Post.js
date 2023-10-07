import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: String,
    description: String,
    picturePath: {type: Object},
    userPicturePath: {type: Object},
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = model("post", postSchema);

export default Post;
