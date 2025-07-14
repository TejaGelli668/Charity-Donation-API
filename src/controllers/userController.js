import User from "../models/UserModel.js";
import { generateToken } from "./utils.js";

export const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      user_id: user._id,
      role: "ROLE_USER",
      email,
      name: user.name,
      phone: user.phone,
    });

    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().lean(); // Use `lean()` to get plain JavaScript objects instead of Mongoose Documents

    // Update each user object to include the `role` field as "Role_user"
    const usersWithRole = users.map((user) => ({
      ...user,
      role: "ROLE_USER",
    }));

    res.status(200).json(usersWithRole);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json({
        name: user.name,
        email: user.email,
        user_id: user._id,
        phone: user.phone,
        role: "ROLE_USER",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
export const createUser = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = new User({
      name,
      email,
      phone,
      password,
    });
    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

// Update an existing user by ID
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      const updatedUser = await user.save();
      res.status(200).json({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: "ROLE_USER",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete an existing user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};
