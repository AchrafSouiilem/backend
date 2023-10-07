import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, image } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      userPicturePath: user.picturePath,
      description: description,
      picturePath: image,
      likes: {},
      comments: [],
    });
    await newPost.save();
    return res.status(203).json({ msg: "new Post", posts: newPost });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({createdAt:-1});
    return res.status(200).json({ msg: "Get all Posts", posts: post });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const post = await Post.find({ userId: req.params.userId }).sort({createdAt:-1});
    return res.status(200).json({ msg: "Get user Posts", posts: post });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

/* UPDATE*/
export const updatePost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {$set: {...req.body}});
    return res.status(200).json({ msg: "post updated" });
  } catch (error) {
    return res.status(404).json({ msg: "post can not updated" });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "can not delete post" });
  }
};

/* LIKES */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const user = await User.findById(userId);
    const isliked = post.likes.get(userId);
    console.log(req.body)

    if (isliked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json({ posts: updatedPost });
  } catch (error) {
    res.status(404).json({ msg: error.message });
    console.log(error)
  }
};
