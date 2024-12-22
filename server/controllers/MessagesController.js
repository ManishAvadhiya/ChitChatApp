import Message from "../models/MessageModel.js";
import {mkdirSync, renameSync} from "fs"

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 === null || !user2 === null) {
      return res.status(400).send("Both user IDs are required");
    }
    const messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      }).sort({timestamp:1});
    return res.status(200).json({messages:messages})
    
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Internal server error");
  }
};
export const uploadFile = async (req, res, next) => {
  try {
    if(!req.file){
      return res.status(400).send("No file uploaded");
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`
    let fileName = `${fileDir}/${req.file.originalname}`

    mkdirSync(fileDir,{recursive: true});
    renameSync(req.file.path,fileName)

    return res.status(200).json({filePath: fileName})
    
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Internal server error");
  }
};