import {Router} from "express"
import { login, signup ,getuserinfo ,updateprofile,addprofileimage,deleteprofileimage, logoutUser } from "../controllers/AuthController.js"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import multer from "multer"
const authRoute = Router()
const upload = multer({dest:"uploads/profile/"})
authRoute.post("/signup",signup)
authRoute.post("/login",login)
authRoute.get("/userinfo",verifyToken, getuserinfo)
authRoute.patch("/updateprofile",verifyToken,updateprofile)
authRoute.post("/addprofileimage",verifyToken,upload.single("profileimage"),addprofileimage)
authRoute.delete("/deleteprofileimage",verifyToken,deleteprofileimage)
authRoute.post("/logout",logoutUser)
export default authRoute; 