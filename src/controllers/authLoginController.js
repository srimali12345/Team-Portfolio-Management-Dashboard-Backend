import RegisterModel from "../models/Auth/authRegisterModel.js";

export const postLoginDetail = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await RegisterModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
     if (user.role !== role) {
      return res.status(403).json({ message: "Invalid role" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("login error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
