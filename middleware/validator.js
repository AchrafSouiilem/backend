import { body, validationResult } from "express-validator";
//const passLength = 8;

export const registerRules = () => [
  body("firstName", "Firstname is required!").notEmpty(),
  body("lastName", "Lastname is required!").notEmpty(),
  body("email", "Email should be an email!").isEmail(),
  //"Password must include one lowercase character, one uppercase character, a number, and a special character."
  body("password", "Please enter a correct password" ) 
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  body("location", "Please enter your location!").notEmpty(),
  body("occupation", "Please enter your occupation!").notEmpty(),
];


export const loginRules = () => [
  body("email", "Please enter your email!").isEmail(),
  body("password", "Please enter your password").notEmpty(),
];

export const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
};
