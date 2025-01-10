import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique:true
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['manager', 'pantry', 'delivery'],
            required: true
        },
        password: {
            type: String,
            required: [true,'Password is required']
        }
    },
    {timestamps: true})

export const User = mongoose.model("User", userSchema)