import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";

export const searchUsers = async (req, res, next) => {
  try {
    const { search } = req.body;
    if (!search == undefined || search == null) {
      return res.status(400).send("Search query is required");
    }
    const cleanedSearch = search.replace(/[^a-zA-Z0-9 ]/g, "");
    const regex = new RegExp(cleanedSearch, "i");
    const users = await User.find({
      $and: [
        {
          _id: { $ne: req.userId },
        },
        {
          $or: [{ firstname: regex }, { lastname: regex }, { email: regex }],
        },
      ],
    });
    return res.status(200).json({ users });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Internal server error");
  }
};

export const getAllDMUsers = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);
    const user = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: {
            $first: "$timestamp",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$userDetails.email",
          firstname: "$userDetails.firstname",
          lastname: "$userDetails.lastname",
          image: "$userDetails.image",
        },
      },
      {
        $sort: {
          lastMessageTime: -1,
        },
      },
    ]);
    return res.status(200).json({ user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Internal server error");
  }
};

export const geAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstname lastname _id email"
    );

    const contacts = users.map((user) => ({
      label: user.firstname ? `${user.firstname} ${user.lastname}` : user.email,
      value: user._id,
      
  }));
  

    return res.status(200).json({ contacts });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Internal server error");
  }
};
