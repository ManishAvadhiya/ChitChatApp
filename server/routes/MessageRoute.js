import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer"
const messageRoute = Router();
const upload = multer({dest : "uploads/files"})
messageRoute.post("/getmessages", verifyToken, getMessages);
messageRoute.post("/upload-file", verifyToken,upload.single("file") ,uploadFile);
export default messageRoute;
