import RegisterModel from "../models/Auth/authRegisterModel.js";

export const postRegisterDetail = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await RegisterModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "Username or Email already exists" });
    }

    const newUser = new RegisterModel({
      name,
      username,
      email,
      password,
      role,
    });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (err) {
    console.error("Error in postRegisterDetail:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
