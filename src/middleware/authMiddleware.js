import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";
import User from "../models/UserModel.js";

export const authorize =
  (roles = []) =>
  async (req, res, next) => {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("Authorization header missing");
    }
    const token = authHeader.split(" ")[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const role = decoded.role;

      if (!roles.includes(role)) return res.status(403).send("Forbidden");

      // Check if the user has the required role
      let user = null;
      if (role === "ROLE_USER") {
        user = await User.findById(decoded.user_id);
      } else if (role === "ROLE_ADMIN") {
        user = await Admin.findById(decoded.user_id);
      }

      if (!user) {
        return res.status(403).send("Forbidden");
      }

      // Add the user ID to the request object for further use
      req.userId = decoded.user_id;

      // Call the next middleware
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send("Invalid token");
    }
  };
