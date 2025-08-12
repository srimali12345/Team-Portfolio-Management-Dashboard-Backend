import TeamMembersModel from "../../models/Team/teamMembersModel.js";

export const addMember = async (req, res) => {
  try {
    const { name, email, role,currentProject,skills } = req.body;
    if (!name || !email || !role || !currentProject || !skills) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMember = {
      name,
      email,
      role,
      currentProject,
      skills: Array.isArray(skills) ? skills : [skills], 
    };
  
    const existingMember = await TeamMembersModel.findOne({ "members.email": email });
    if (existingMember) {
        return res.status(409).json({ message: "Member with this email already exists" });
        }   

    const teamMember = await TeamMembersModel.findOneAndUpdate(
      {},
      { $push: { members: newMember } },
      { new: true, upsert: true }
    );
    res.status(201).json(teamMember);
    } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Internal server error" });
    }
    };
  
export const getMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMembersModel.find({});
    if (!teamMembers || teamMembers.length === 0) {
      return res.status(404).json({ message: "No team members found" });
    }
    res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, role, project, skills } = req.body;

    if (!fullname || !email || !role || !project || !skills) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedMember = await TeamMembersModel.findOneAndUpdate(
      { "members._id": id },
      {
        $set: {
          "members.$.fullname": fullname,
          "members.$.email": email,
          "members.$.role": role,
          "members.$.currentProject": currentProject,
          "members.$.skills": skills,
        },
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTeam = await TeamMembersModel.findOneAndUpdate(
      { "members._id": id },
      { $pull: { members: { _id: id } } },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMembersModel.findOne({ "members._id": id }, { "members.$": 1 });

    if (!teamMember || teamMember.members.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(teamMember.members[0]);
  } catch (error) {
    console.error("Error fetching member by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMembersByProject = async (req, res) => {
  try {
    const { project } = req.params;

    const teamMembers = await TeamMembersModel.find({ "members.project": project }, { "members.$": 1 });

    if (!teamMembers || teamMembers.length === 0) {
      return res.status(404).json({ message: "No members found for this project" });
    }

    res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Error fetching members by project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMembersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const teamMembers = await TeamMembersModel.find({ "members.role": role }, { "members.$": 1 });  
    if (!teamMembers || teamMembers.length === 0) {
      return res.status(404).json({ message: "No members found for this role" });
    }

    res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Error fetching members by role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMembersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const teamMembers = await TeamMembersModel.find({ "members.email": email }, { "members.$": 1 });
    
    if (!teamMembers || teamMembers.length === 0) {
      return res.status(404).json({ message: "No members found with this email" });
    }   
    res.status(200).json(teamMembers);
    }
    catch (error) {
    console.error("Error fetching members by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
