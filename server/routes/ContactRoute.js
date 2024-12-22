import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { geAllUsers, getAllDMUsers, searchUsers } from "../controllers/ContactControllers.js";
const contactRoute = Router()

contactRoute.post("/search",verifyToken,searchUsers)
contactRoute.get("/get-users-dm",verifyToken,getAllDMUsers)
contactRoute.get("/get-all-users",verifyToken,geAllUsers)
export default contactRoute; 
