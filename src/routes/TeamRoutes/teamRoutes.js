import express from "express";      
import { addMember,getMembers,updateMember,deleteMember, getPortfolioByMemberId, getMemberStats } from "../../controllers/TeamMembers/membersController.js";

const router = express.Router();

router.post('/addMember', addMember )
router.get('/getMembers', getMembers);
router.put('/updateMember/:id', updateMember);
router.delete('/deleteMember/:id', deleteMember);
router.get('/getMembers/:id', getMembers);
router.get('/portfolio/:id',getPortfolioByMemberId );
router.get('/getMemberStats', getMemberStats);




export default router;
