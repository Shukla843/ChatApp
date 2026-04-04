import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // validation
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // profile photo
    const maleProfilePhoto = `https://api.dicebear.com/9.x/avataaars/png?seed=${fullName}&gender=male`;
    const femaleProfilePhoto = `https://api.dicebear.com/9.x/avataaars/png?seed=${fullName}&gender=female`;

    await User.create({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });

  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    console.log("JWT Token Generated:", token);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,      // ✅ secure
       
        secure: true,        // must for production
  sameSite: "none" ,    // REQUIRED for cross-site  // ✅ CSRF protection
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
      });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // ✅ better than maxAge:0
      })
      .json({
        message: "Logged out successfully",
      });
  } catch (error) {
    console.log("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET OTHER USERS (Protected route)
export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.id;

    const otherUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(otherUsers);

  } catch (error) {
    console.log("GetOtherUsers Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};