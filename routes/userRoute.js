import express from 'express'
import { Login, Register, bookmark, follow, getMyprofile, getOtherUsers, logout, unFollow } from '../controllers/userControllers.js';  
import isAuthenticated from '../config/auth.js';

const router = express.Router();

router.post("/register", Register);
router.post("/login",Login);
router.get("/logout",logout);
router.put("/bookmark/:id",isAuthenticated,bookmark);
router.get("/profile/:id",isAuthenticated,getMyprofile)
router.get("/getotheruser/:id",isAuthenticated,getOtherUsers)
router.post('/follow/:id',isAuthenticated,follow);
router.post('/unfollow/:id',isAuthenticated,unFollow);


export default router;




