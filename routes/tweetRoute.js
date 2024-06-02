import express from 'express';
import isAuthenticated from '../config/auth.js';
import { createTweet, deleteTweet, getAllTweet, getFollowingTweets, likeDislike } from '../controllers/tweetController.js';

const router = express.Router();

router.post("/create",isAuthenticated,createTweet);
router.delete("/delete/:id",isAuthenticated,deleteTweet);
router.put("/like/:id",isAuthenticated,likeDislike);
router.get("/alltweet/:id",isAuthenticated,getAllTweet);
router.get("/getfollowingtweet/:id",isAuthenticated,getFollowingTweets);


export default router;
