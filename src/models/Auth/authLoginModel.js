import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LoginModel = mongoose.model("LoginModel", loginSchema);

export default LoginModel;
