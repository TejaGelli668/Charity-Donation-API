import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET_KEY;
  const options = { expiresIn: "1d" }; // token will expire after 1 day

  return jwt.sign(payload, secret, options);
};
