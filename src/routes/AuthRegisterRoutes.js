import express from 'express';
import { postRegisterDetail } from '../controllers/authRegisterController.js';


const router = express.Router();

router.post('/auth/register', postRegisterDetail)

export default router;