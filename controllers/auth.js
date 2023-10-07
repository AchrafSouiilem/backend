import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: "../config/.env" });

/*REGISTER*/

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      image,
      friends,
      location,
      occupation,
    } = req.body;
    /* check for existing user */
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ msg: "User already exists" });
    }
    /* crypting the password*/
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    /*create new user*/
    const newUser =  new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: image,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    /*save the user*/
    const savedUser = await newUser.save();
    /* Get a Token */
    const payload = { id: savedUser.id };
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    /* registred successfully */
    res.status(201).json({
      msg: "user registred successfully",
      response: savedUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    /* check the user email*/
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "user does not exist!" });
    }
    /* check the password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    /* Get a Token */
    const payload = { id: user.id };
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    /* login successfully */
    res
      .status(200)
      .json({ msg: "User Logged successfully", token, response: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET USER */
export const getUser = async (req, res) => {
  try {
    return res.status(200).json({ msg: "Get User", response: req.user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const response = await User.findByIdAndUpdate(req.params.id, {$set: {...req.body}})
    return res.status(200).json({ msg: "profile updated", update: response });
  } catch (error) {
    return res.status(404).json({ msg: "profile can not updated" });
  }
}