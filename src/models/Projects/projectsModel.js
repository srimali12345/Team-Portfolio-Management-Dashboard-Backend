import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming",
  },
  members: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeamMembersModel",
        required: true,
      },
      role: { type: String, required: true },
    },
  ],
});

const ProjectModel = mongoose.model("ProjectModel", projectSchema);
export default ProjectModel;
