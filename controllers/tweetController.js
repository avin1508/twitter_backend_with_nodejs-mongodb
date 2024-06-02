import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async(req,res) =>{
    try {
        const{description,id} = req.body;
        if(!description || !id){
            return res.status(401).json({
                message:"Fields are required.",
                success: false
            })
        };
        await Tweet.create({
            description,
            userId:id
        });
        return res.status(201).json({
            message:"Tweet created successfully.",
            success:true,
        })
    } catch (error) {
        console.log(erro)
    }
}

export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params; 
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Tweet deleted successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const likeDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found" });
        }
        if (tweet.like.includes(loggedInUserId)) {
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } });
            return res.status(200).json({ message: "User disliked your tweet" });
        } else {
            await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } });
            return res.status(200).json({ message: "User liked your tweet" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllTweet = async (req, res) => {
    try {
        const userId = req.params.id; 
        const loggedInUser = await User.findById(userId);
        const userTweets = await Tweet.find({ userId });
        const followingTweets = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Tweet.find({ userId: otherUserId });
        }));
        const allTweets = userTweets.concat(...followingTweets);
        return res.status(200).json({ tweets: allTweets });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getFollowingTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id); 
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUserId) =>{
            return Tweet.find({ userId: otherUserId });
        }));
        return res.status(200).json({
            tweets: [].concat(...followingUserTweet) 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
