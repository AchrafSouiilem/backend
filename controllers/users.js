import User from "../models/User.js";

/* READ */
// export const getUsers = async (req, res) => {
//   try {
//     const user = await User.find();
//     res.status(200).json({ msg: "get all users", users: user });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, location, picturePath }) => {
        return { _id, firstName, lastName, location, picturePath };
      }
    );
    res
      .status(200)
      .json({ msg: "get user friends", friends: formattedFriends });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* UPDATE */
export const addFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, location, picturPath }) => {
        return { _id, firstName, lastName, location, picturPath };
      }
    );
    res.status(200).json({ friends: formattedFriends });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* DELETE */

export const removeFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    }
    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, location, picturPath }) => {
        return { _id, firstName, lastName, location, picturPath };
      }
    );
    res.status(200).send({ friends: formattedFriends });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

