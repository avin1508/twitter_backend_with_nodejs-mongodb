import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email",
                success: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
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

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User does not exist with this email.",
                success: false
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }
        const tokenData = {
            userId: user._id 
        };
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = (req,res) =>{
   return res.cookie("token","",{expiresIn: new Date(Date.now())}).json({
    message:"user logged out successfully.",
    success:true
   });
};

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        if (!loggedInUserId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!tweetId) {
            return res.status(400).json({ message: "Tweet ID is required" });
        }
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.bookmarks.includes(tweetId)) {
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "removed from bookmarks"
            });
        } else {
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "saved to bookmarks"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}
export const getMyprofile = async (req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })
    } catch (error) {
        console.log(error)
    }
}

export const getOtherUsers = async (req,res) =>{
    try {
        const id = req.params.id;
        const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
        if(!otherUsers){
            return res.status(401).json({
                message:"currently do not have any users."
            })
        }
        return res.status(200).json({
            otherUsers
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}


export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;
        const userId = req.body.id;
        const wantstofollow = await User.findById(loggedInUserId);
        const following = await User.findById(userId);

        if (!following.followers.includes(loggedInUserId)) {
            await following.updateOne({ $push: { followers: loggedInUserId } });
            await wantstofollow.updateOne({ $push: { following: userId } });
            return res.status(200).json({
                message: `${wantstofollow.name} just followed ${following.name}`,
                success: true
            });
        } else {
            return res.status(400).json({ message: `User is already followed ${following.name}` });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const unFollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        console.log("Logged-in User ID:", loggedInUserId);
        console.log("User to Unfollow ID:", userId);

        const loggedInUser = await User.findById(loggedInUserId);
        const userToUnFollow = await User.findById(userId);

        console.log("Logged-in User:", loggedInUser);
        console.log("User to Unfollow:", userToUnFollow);

        if (userToUnFollow.following.includes(loggedInUserId)) {
            await userToUnFollow.updateOne({ $pull: { following: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { followers: userId } });

            console.log("Unfollow Successful");

            // Fetch the updated user data after unfollowing
            const updatedUser = await User.findById(loggedInUserId);

            return res.status(200).json({
                message: `${loggedInUser.name} just unfollowed ${userToUnFollow.name}`,
                success: true,
                user: updatedUser // Send updated user data in the response
            });
        } else {
            console.log("User is not following the target user");
            return res.status(400).json({
                message: `${loggedInUser.name} is not following ${userToUnFollow.name}`
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
