import LoginModel from "../models/Auth/authLoginModel";

export const postLoginDetail = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await LoginModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.log("login error", error);
  }
};
