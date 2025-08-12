import mongoose from "mongoose";

const teamMembersSchema = new mongoose.Schema({
 
  members: [
    {
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      currentProject:{
        type: String,
        required: false,
      },
      skills: {
        type: [String],
        required: true,
      },
      status:{
        type: String,
        enum: ["active", "bench"],
        default: "active",
      }
    }
    ]

})

const TeamMembersModel = mongoose.model("TeamMembersModel", teamMembersSchema);

export default TeamMembersModel;
