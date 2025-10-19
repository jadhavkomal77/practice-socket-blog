import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { checkEmpty } from "../utils/checkEmpty.js";
import Upload from "../utils/upload.js";
import cloudinary from "../utils/cloudinary.config.js";
import Admin from "../models/Admin.js";

// ------------------ Register ------------------ //
export const adminRegister = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const { isError, error } = checkEmpty({ name, email, password });
    if (isError)
      return res.status(400).json({ message: "All fields required", error });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({
        message:
          "Weak password. Include uppercase, lowercase, numbers & special characters.",
      });

    if (phone && !validator.isMobilePhone(phone, "en-IN"))
      return res.status(400).json({ message: "Invalid phone number" });

    const isFound = await Admin.findOne({ email });
    if (isFound)
      return res.status(409).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email,
      mobile: phone,
      role: "admin",
      password: hash,
    });

    res.json({
      message: "Admin registered successfully",
      result: admin,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ------------------ Login ------------------ //
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isFound = await Admin.findOne({ email });
    if (!isFound) return res.status(401).json({ message: "Email not found" });
    if (!isFound.isActive)
      return res
        .status(403)
        .json({ message: "Your account is deactivated. Please contact support." });

    const isVerify = await bcrypt.compare(password, isFound.password);
    if (!isVerify)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { userId: isFound._id, role: isFound.role },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    res.cookie("admin", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      message: "Login successful",
      result: {
        _id: isFound._id,
        name: isFound.name,
        email: isFound.email,
        mobile: isFound.mobile,
        role: isFound.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ------------------ Logout ------------------ //
export const adminLogout = (req, res) => {
  res.clearCookie("admin");
  res.json({ message: "Logout successful" });
};

// ------------------ Get Admin Profile ------------------ //
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Profile fetched successfully", result: admin });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

// ------------------ Update Admin Profile ------------------ //
export const updateAdminProfile = async (req, res) => {
  try {
    Upload(req, res, async (err) => {
      if (err)
        return res.status(400).json({ message: "Upload error", error: err });

      const { name, email, phone } = req.body;
      const { isError, error } = checkEmpty({ name, email });
      if (isError)
        return res.status(400).json({ message: "All fields required", error });

      let hero = "";
      if (req.file) {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        hero = secure_url;
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        req.user.userId,
        { name, email, mobile: phone, hero },
        { new: true, runValidators: true }
      ).select("-password");

      res.json({
        message: "Profile updated successfully",
        result: updatedAdmin,
      });
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ------------------ Get All Admins (Superadmin Only) ------------------ //
export const getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ message: "Access denied" });

    const admins = await Admin.find().select("-password");
    res.json({ message: "Admins fetched successfully", result: admins });
  } catch (err) {
    console.error("Get All Admins Error:", err);
    res
      .status(500)
      .json({ message: "Error fetching admins", error: err.message });
  }
};

// ------------------ Deactivate Admin (Superadmin Only) ------------------ //
export const deactivateAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ message: "Access denied" });

    await Admin.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Admin deactivated successfully" });
  } catch (err) {
    console.error("Deactivate Error:", err);
    res
      .status(500)
      .json({ message: "Error deactivating admin", error: err.message });
  }
};
