
import RegisterModel from "../models/Auth/registerModel.js";

export const postRegisterDetail = async (req, res) => {
  try{
 const {name, username, email,password}=req.body;
 const newUser = new RegisterModel({name, username, email, password})
 await newUser.save();
 res.status(201).json(newUser);
  }catch(err){
console.log(err)
  }
};
