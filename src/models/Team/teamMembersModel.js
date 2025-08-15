import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: String,
  role: String,
  startDate: Date,
  endDate: Date,
});


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
      currentProject: {
        type: String,
        required: false,
      },
      skills: {
        type: [String],
        required: true,
      },
      status: {
        type: String,
        enum: ["active", "bench"],
        default: "active",
      },
       projects: [projectSchema],
    },
  ],
});

const TeamMembersModel = mongoose.model("TeamMembersModel", teamMembersSchema);

export default TeamMembersModel;
