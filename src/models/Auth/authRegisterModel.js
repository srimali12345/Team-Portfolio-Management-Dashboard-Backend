import mongoose, { Schema } from "mongoose";

const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required:true,
  },
});

const RegisterModel = mongoose.model("RegisterModel", RegisterSchema);

export default RegisterModel;
