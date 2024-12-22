import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js";

import { createChannel, getChannelMessages, getUserChannel } from "../controllers/ChannelController.js"; 
const channelRoute = Router()

channelRoute.post("/create-channel",verifyToken,createChannel)
channelRoute.get("/allChannels",verifyToken,getUserChannel) 
channelRoute.get("/channelmessages/:channelId",verifyToken,getChannelMessages) 

export default channelRoute; 
