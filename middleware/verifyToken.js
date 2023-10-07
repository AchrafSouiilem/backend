import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "../config/.env" });

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['x-auth-token'];
    /* check for token */
    if (!token) {
      return res.status(403).send({ msg: "Access Denied" });
    }
    /* verify token */
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    //get user by id from payload
    const user = await User.findById(decoded.id)
    /* get user */
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
