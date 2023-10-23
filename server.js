import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import loginRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { registerRules, validator } from "./middleware/validator.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/verifyToken.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/*CONFIGURATIONS*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: "./config/.env" });
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
//app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/Images", express.static(path.join(__dirname, "public/Images")));

app.use(cors({
  origin: "*",
  methods: "*",  
}));

/*FILE STORAGE*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/Images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// /*POST ROUTES WITH FILES*/
app.post("/API/auth/register", upload.single("image"), registerRules(), validator, register);
app.post("/API/posts/", upload.single("image"), verifyToken, createPost);

// /*POST ROUTES WITH FILES*/
// app.post("/API/auth/register", upload.single("image"), registerRules(), validator, register);
// app.post("/API/posts/", upload.single("image"), verifyToken, createPost);

// /*FILE STORAGE*/
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

// /*POST ROUTES WITH FILES*/
// app.post("/API/auth/register", upload.single("picture"), registerRules(), validator, register);
// app.post("/API/posts/", upload.single("picture"), verifyToken, createPost);


/*ROUTES*/
app.use("/API/auth", loginRoutes);
app.use("/API/users", userRoutes);
app.use("/API/posts", postRoutes);

/*MONGOOSE SETUP*/
connectDB();

/* RUNING THE SERVER */
const PORT = process.env.PORT || 3001;
app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`server port: ${PORT}`);

  /* ADD DATA ONE TIME */
  // User.insertMany(users);
  // Post.insertMany(posts);
});
