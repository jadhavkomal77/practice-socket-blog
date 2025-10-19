import User from "../models/User.js"; // include .js extension


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ message: "Users fetched successfully", result: users });
  } catch (err) {
    console.error("getAllUsers Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Deactivate a user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isActive: false });
    res.json({ message: "User deactivated successfully" });
  } catch (err) {
    console.error("deactivateUser Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
