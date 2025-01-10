import mongoose, {Schema} from "mongoose";

const patientSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "patient's name is required"]
        },
        age: {
            type: Number,
            required: [true, "patient's age is required"]
        },
        gender: {
            type: String,
            required: [true, "patient's gender is required"],
            enum: ['male', 'female'],
        },
        contactNumber: {
            type: String,
            required: [true, "patient's contact number is required"],
            unique: true
        },
        emergencyContactNumber: {
            type: String,
            required: [true, "patient's emergency contact number is required"],
        },
        address: {
            type: String,
            required: [true, "patient's address is required"]
        },
        email: {
            type: String,
            required: [true, "patient's email is required"],
            unique: true
        },
        diseases: {
            type: [String],
            required: [true, "patient's diseases is required"]
        },
        allergies: {
            type: [String],
            default: []
        },
        roomNumber: {
            type: String,
            required: true
        },
        floorNumber: {
            type: String,
            required: true
        },
        bedNumber: {
            type: String,
            required: true
        },
        medicalHistory: {
            type: [String],
            default: []
        },
    },
    {timestamps: true})

export const Patient = mongoose.model("Patient", patientSchema)