import ProjectModel from "../../models/Projects/projectsModel.js";
import TeamMembersModel from "../../models/Team/teamMembersModel.js";

export const addMember = async (req, res) => {
  try {
    const { name, email, role, currentProject, skills } = req.body;
    if (!name || !email || !role || !skills) {
      return res
        .status(400)
        .json({ message: "Name, email, role, and skills are required" });
    }

    const newMember = {
      name,
      email,
      role,
      currentProject: currentProject || null,
      skills: Array.isArray(skills) ? skills : [skills],
      status: currentProject ? "active" : "bench",
      projectHistory: [],
    };

    const existingMember = await TeamMembersModel.findOne({
      "members.email": email,
    });
    if (existingMember) {
      return res
        .status(409)
        .json({ message: "Member with this email already exists" });
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
    const teamData = await TeamMembersModel.find({});
    const allMembers = teamData.reduce((acc, team) => {
      return acc.concat(team.members || []);
    }, []);
    res.status(200).json(allMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, currentProject, skills } = req.body;
    const status = currentProject ? "active" : "bench";

    if (!name || !email || !role || !skills) {
      return res
        .status(400)
        .json({ message: "All fields except currentProject are required" });
    }

    const updatedMember = await TeamMembersModel.findOneAndUpdate(
      { "members._id": id },
      {
        $set: {
          "members.$.name": name,
          "members.$.email": email,
          "members.$.role": role,
          "members.$.currentProject": currentProject || null,
          "members.$.skills": skills,
          "members.$.status": status,
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
};

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

    const teamMember = await TeamMembersModel.findOne(
      { "members._id": id },
      { "members.$": 1 }
    );

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

    const teamMembers = await TeamMembersModel.find(
      { "members.project": project },
      { "members.$": 1 }
    );

    if (!teamMembers || teamMembers.length === 0) {
      return res
        .status(404)
        .json({ message: "No members found for this project" });
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

    const teamMembers = await TeamMembersModel.find(
      { "members.role": role },
      { "members.$": 1 }
    );
    if (!teamMembers || teamMembers.length === 0) {
      return res
        .status(404)
        .json({ message: "No members found for this role" });
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

    const teamMembers = await TeamMembersModel.find(
      { "members.email": email },
      { "members.$": 1 }
    );

    if (!teamMembers || teamMembers.length === 0) {
      return res
        .status(404)
        .json({ message: "No members found with this email" });
    }
    res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Error fetching members by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMemberStats = async (req, res) => {
  try {
    const teamData = await TeamMembersModel.find({});
    if (!teamData || teamData.length === 0) {
      return res.status(404).json({ message: "No team members found" });
    }

    const members = teamData[0].members || [];

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === "active").length;
    const benchMembers = members.filter((m) => m.status === "bench").length;

    res.status(200).json({
      totalMembers,
      activeMembers,
      benchMembers,
    });
  } catch (error) {
    console.error("Error fetching member stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchAndFilterMembers = async (req, res) => {
  try {
    const { search, role, project, startDate, endDate, benchOnly } = req.query;

    let matchQuery = {};

    if (search) {
      matchQuery.$or = [
        { "members.name": { $regex: search, $options: "i" } },
        { "members.email": { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      matchQuery["members.role"] = role;
    }

    if (project) {
      matchQuery["members.currentProject"] = project;
    }

    if (benchOnly === "true") {
      matchQuery["members.status"] = "bench";
    }

    const pipeline = [{ $unwind: "$members" }, { $match: matchQuery }];

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) {
        dateFilter["members.projectHistory.startDate"] = {
          $gte: new Date(startDate),
        };
      }
      if (endDate) {
        dateFilter["members.projectHistory.endDate"] = {
          $lte: new Date(endDate),
        };
      }
      pipeline.push({ $match: dateFilter });
    }

    const results = await TeamMembersModel.aggregate(pipeline);
    res.status(200).json(results.map((r) => r.members));
  } catch (error) {
    console.error("Error filtering members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPortfolio = async (req,res)=>{
  
  try {
    const member = await TeamMember.findById(req.params._id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json({ portfolio: member.projects || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



