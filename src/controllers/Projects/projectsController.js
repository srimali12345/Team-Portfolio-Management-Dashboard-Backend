import ProjectModel from "../../models/Projects/projectsModel.js";
import TeamMembersModel from "../../models/Team/teamMembersModel.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({}).lean();
    const teamData = await TeamMembersModel.find({}).lean();
    const allMembers = teamData.reduce((acc, team) => {
      return acc.concat(team.members || []);
    }, []);

    const formatted = projects.map((p) => ({
      ...p,
      startDate: new Date(p.startDate).toLocaleDateString(),
      endDate: p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
      members: p.members.map((m) => {
        const memberDetails = allMembers.find(
          (member) => member._id.toString() === m.memberId.toString()
        );
        return {
          memberId: m.memberId,
          name: memberDetails?.name || "N/A",
          email: memberDetails?.email || "N/A",
          role: memberDetails?.role || "N/A",
        };
      }),
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, members } = req.body;
    if (!name || !startDate)
      return res.status(400).json({ message: "Name and startDate required" });

    const teamData = await TeamMembersModel.find({}).lean();
    const allMembers = teamData.reduce((acc, team) => {
      return acc.concat(team.members || []);
    }, []);

    const membersData = members?.map((memberId) => {
      const memberDetails = allMembers.find(
        (member) => member._id.toString() === memberId
      );
      return {
        memberId,
        role: memberDetails?.role || "N/A",
      };
    });

    const newProject = await ProjectModel.create({
      name,
      description,
      startDate,
      endDate: endDate || null,
      status: status || "upcoming",
      members: membersData || [],
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, status, members } = req.body;

    const teamData = await TeamMembersModel.find({}).lean();
    const allMembers = teamData.reduce((acc, team) => {
      return acc.concat(team.members || []);
    }, []);

    const membersData = members?.map((memberId) => {
      const memberDetails = allMembers.find(
        (member) => member._id.toString() === memberId.toString()
      );
      return {
        memberId,
        role: memberDetails?.role || "N/A",
      };
    });

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate, status, members: membersData },
      { new: true }
    );

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });
    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const activateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      { status: "active" },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project moved to Working", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProjectModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMemberPortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await ProjectModel.find({ "members.memberId": id })
      .populate("members.memberId", "name email role")
      .lean();

    const projectHistory = projects.map((p) => {
      const member = p.members.find((m) => m.memberId._id.toString() === id);
      return {
        _id: p._id,
        projectName: p.name,
        role: member?.role || "N/A",
        startDate: p.startDate,
        endDate: p.endDate,
        description: p.description,
      };
    });

    const member = await TeamMembersModel.findById(id).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.status(200).json({
      ...member,
      projectHistory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
