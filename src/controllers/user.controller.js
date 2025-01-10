import {User} from "../models/user.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookie from "cookie"

const generateToken = async(user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '1h',
    });
    return token;
};

const registerUser = asyncHandler(async(req, res) => {
    try {
        // get data from body
        const {name, email, password, role} = req.body;
        if(
            !name ||
            !email ||
            !password ||
            !role
        ) {
            throw new ApiError(400,"Please provide all fields");
        }
    
        // chcek if user already exists
        const existingUser = await User.findOne({email: email});
        if(existingUser) {
            throw new ApiError(400, "Email already exists");
        }
    
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // create new user
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        })
        await user.save();
    
        // return res
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                user,
                "User created successfully",
            )
        )
    } catch (error) {
        console.log("Error while registering user : ", error);
        throw new ApiError(500, "Internal server error while registering user");
    }
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        // get credentials from user
        const {email, password} = req.body
        if(!email || !password) {
            throw new ApiError(404, 'Please provide both email and password');
        }
    
        // find the user in db
        const user = await User.findOne({email})
        if(!user) {
            throw new ApiError(404, 'User not found')
        }
    
        // compare the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            throw new ApiError(404, 'Invalid password')
        }
    
        // generate token
        const token = await generateToken(user)
    
        // set token in cookie
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
            path: '/',
            sameSite: 'strict',
        }));
    
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                },
                'User logged in successfully',
            )
        )
    } catch (error) {
        console.log("Error while logging the user : ", error)
        throw new ApiError(500, `Internal server error while login`)
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    try {
        // Clear the JWT token cookie
        res.setHeader('Set-Cookie', cookie.serialize('token', '', {
            httpOnly: true,
            secure: true,
            maxAge: -1,
            path: '/',
            sameSite: 'strict',
        }));

        //return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'User logged out successfully',
            )
        )
    } catch (error) {
        console.log("Error while logging out the user : ", error);
        throw new ApiError(500, `Internal server error while logout`)
    }
})

export {
    loginUser,
    logoutUser,
    registerUser
}