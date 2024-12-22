import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userID) => {
  return jwt.sign({ email, userID }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required");
    }

    const user = await User.create({ email, password });

    // Create JWT Token
    const token = createToken(email, user.id);

    // Set the cookie with added options
    res.cookie("jwt", token, {
      maxAge, // Expiry for the cookie
      httpOnly: true, // Makes cookie inaccessible from client-side JavaScript
      secure: true, // Ensure HTTPS is enabled
      sameSite: "None", // Cross-site requests
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found with the given email id");
    }
    const auth =await compare(password, user.password);


    if (!auth) {
      return res.status(400).send("Password is incorrect");
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getuserinfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found with the given id");
    }
    return res.status(202).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstname: user.firstname,
      lastname: user.lastname,
      image: user.image,
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Intenal server error");
  }
};

export const updateprofile = async (req, res, next) => {
  try {
    const { useremail, firstname, lastname } = req.body;
    if (!firstname || !lastname) {
      return res.status(400).send("Firstname and Lastname are required");
    }
    const temp = await User.findOne({ email: useremail });
    const user = await User.findByIdAndUpdate(
      temp.id,
      { firstname, lastname, profileSetup: true },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
      },
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Internal server error");
  }
};

export const addprofileimage = async (req, res, next) => {
  try {
    const userEmail = req.body.useremail;

    if (!req.file) {
      return res.status(400).send("Profile image is required");
    }
    const date = Date.now();
    let fileName = "uploads/profile/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);
    const temp = await User.findOne({ email: userEmail });

    const updatedUser = await User.findByIdAndUpdate(
      temp.id,
      { image: fileName },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Internal server error");
  }
};

export const deleteprofileimage = async (req, res, next) => {
    try {
       
    
        const userEmail = req.body.useremail;
        if (!userEmail) {
          return res.status(400).send("User email is required");
        }
    
        const user = await User.findOne({ email: userEmail.trim() }); // Trim to avoid trailing spaces
    
        if (!user) {
          console.log("User not found for email:", userEmail); // Log when user is not found
          return res.status(404).send("User not found");
        }
    
        // Remove the profile image
        user.image = null; // Set to null or a default image path if necessary
        await user.save();
    
        return res.status(200).send("Profile image removed successfully");
      } catch (err) {
        console.log("Error:", err);
        return res.status(500).send("Internal server error");
      }
};

export const logoutUser = async (req,res,next) => {
  try{
      res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"})
      res.status(200).send("Logout successfull")
  }catch(err){
    console.log("Error:", err);
    return res.status(500).send("Internal server error");
  }
}