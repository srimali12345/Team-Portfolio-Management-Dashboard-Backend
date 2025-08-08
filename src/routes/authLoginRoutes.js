import express from 'express';
import { postLoginDetail } from '../controllers/authLoginController.js';


const router = express.Router();

router.post('/auth/login', postLoginDetail)

export default router;

