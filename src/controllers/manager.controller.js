import {Patient} from "../models/patient.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { DietChart } from "../models/dietChart.model.js"

const addPatient = asyncHandler(async (req, res) => {
    try {
        // get patient's data from body
        const { 
            name, 
            age, 
            gender, 
            contactNumber, 
            emergencyContactNumber, 
            address, 
            email, 
            diseases, 
            allergies, 
            roomNumber, 
            floorNumber, 
            bedNumber, 
            medicalHistory
        } = req.body
        // throw error if required fields are missing
        if(
            !name || 
            !age || 
            !gender || 
            !contactNumber || 
            !emergencyContactNumber || 
            !address || 
            !email || 
            !diseases || 
            !roomNumber ||
            !floorNumber ||
            !bedNumber
        ) {
            throw new ApiError(404, "Required patient's details are missing")
        }
    
        // check if current user is manager 
        if(!(req.user.role === "manager")) {
            throw new ApiError(403, "You are not authorized to add patient");
        }
    
        // create new patient
        const patient = new Patient({
            name,
            age,
            gender,
            contactNumber,
            emergencyContactNumber,
            address,
            email,
            diseases,
            allergies : allergies || [],
            roomNumber,
            floorNumber,
            bedNumber,
            medicalHistory : medicalHistory || []
        })
        await patient.save()
    
        // return res
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                patient,
                "Patient added successfully",
            )
        )
    } catch (error) {
        console.log("Error while adding patient : ", error)
        throw new ApiError(500, "Internal server error while adding new patient")
    }
})

const getPatient = asyncHandler(async (req, res) => {
    try {
        // get patientId from req
        const {patientId} = req.params
        if(!patientId) {
            throw new ApiError(400, "Provide a patientId")
        }
    
        // find patient in db
        const patient = await Patient.findById(patientId)
        if(!patient) {
            throw new ApiError(404, "Patient not found")
        }
    
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                patient,
                "Patient found successfully",
            )
        )
    } catch (error) {
        console.log("Error while fetching patient details : ", error);
        throw new ApiError(500, "Internal server error while fetching patient details")
    }
})

const updatePatient = asyncHandler(async (req, res) => {
    try {
        // get patientId from req
        const {patientId} = req.params
        if(!patientId) {
            throw new ApiError(400, "Provide a patientId")
        }
    
        // check if user is manager
        if(!(req.user.role === "manager")) {
            throw new ApiError(403, "You are not authorized to update the user")
        }
    
        // find patient in db
        const patient = await Patient.findById(patientId)
        if(!patient) {
            throw new ApiError(404, "Patient not found")
        }
    
        // update the patient in db
        const updatedPatient = await Patient.findByIdAndUpdate(patientId, req.body, {new: true})
        
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPatient,
                "Patient updated successfully",
            )
        )
    } catch (error) {
        console.log("Error while updating patient details : ", error);
        throw new ApiError(500, "Internal error while updating patient details")
    }
})

const removePateint = asyncHandler(async (req, res) => {
    try {
        // get patient is from req
        const {patientId} = req.params
        if(!patientId) {
            throw new ApiError(400, "Provide a patientId");
        }
    
        // check if user is manager
        if(!(req.user.role === "manager")){
            throw new ApiError(403, "You are not authorized to remove patient")
        }
    
        // delete the patient from db
        const patient = await Patient.findById(patientId)
        if(!patient) {
            throw new ApiError(404, "Patient not found")
        }
        const deletedPatient = await Patient.findByIdAndDelete(patientId)
    
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Patient removed successfully"
            )
        )
    } catch (error) {
        console.log("Error while removing the patient : ", error);
        throw new ApiError(500, "Internal server error while removing patient")
    }
})

const getAllPatients = asyncHandler(async (req, res) => {
    try {
        // check if user is manager
        if(!(req.user.role === "manager" || req.user.role === "pantry")){
            throw new ApiError(403, "You are not authorized to view all patients")
        }

        // get all patients
        const patients = await Patient.find()
        if(patients.length === 0) {
            return res.status(200).json(new ApiResponse(200,[],"No patients found"))
        }

        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                patients,
                "All patients retrieved successfully",
            )
        )
    } catch (error) {
        console.log("Error while fetching all patients : ", error);
        throw new ApiError(500, "Internal server error while fetching all patients")
    }
})

const createDietChart = asyncHandler(async (req, res) => {
    try {      
        // get patientId from params
        const {patientId} = req.params
        if(!patientId) {
            throw new ApiError(400, "Provide the patientId")
        }
    
        // get data from req
        const {morningMeal, eveningMeal, nightMeal, ingredients, instructions} = req.body
        if(
            !morningMeal ||
            !eveningMeal ||
            !nightMeal
        ) {
            throw new ApiError(400, "Provide required meals")
        }
    
        // check if user is manager
        if(!(req.user.role === "manager")) {
            throw new ApiError(403, "You are not authorized to create diet chart")
        }

        // check if patient exists
        const patient = await Patient.findById(patientId)
        if(!patient) {
            throw new ApiError(404, "Patient doesn't exists")
        }

        // check if patient have diet chart already
        const existingDietChart = await DietChart.findOne({patient: patientId})
        if(existingDietChart) {
            throw new ApiError(400, "Patient already have diet chart")
        }
    
        // create diet chart in db
        const dietChart = await DietChart.create({
            patient: patientId,
            morningMeal,
            eveningMeal,
            nightMeal,
            ingredients: ingredients || [],
            instructions: instructions || []
        })
        await dietChart.save()
    
        // return res
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                dietChart,
                "Diet chart created successfully!"
            )
        )
    } catch (error) {
        console.log("Error while creating diet chart : ", error);
        throw new ApiError(500, "Internal server error while creating diet chart")
    }
})

const updateDietChart = asyncHandler(async (req, res) => {
    try {
        // get dietChartId from params
        const {dietChartId} = req.params
        if(!dietChartId) {
            throw new ApiError(400, "Diet chart id is required")
        }
    
        // check if this diet chart exists in db
        const dietChart = await DietChart.findById(dietChartId)
        if(!dietChart) {
            throw new ApiError(404, "Diet chart doesn't exists")
        }

        // check if user is manager
        if(!(req.user.role === "manager")) {
            throw new ApiError(403, "You are not authorized to update diet chart")
        }
    
        // update the diet chart
        const updatedDietChart = await DietChart.findByIdAndUpdate(dietChartId, req.body, {new: true})
    
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedDietChart,
                "Diet chart updated successfully!"
            )
        )
    } catch (error) {
        console.log("Error while updating diet chart : ", error);
        throw new ApiError(500, "Internal server error while updating diet chart")
    }
})

const deleteDietChart = asyncHandler(async (req, res) => {
    try {
        // get dietChartId from params
        const {dietChartId} = req.params
        if(!dietChartId) {
            throw new ApiError(400, "Diet chart id is required")
        }
    
        // check if this diet chart exists in db
        const dietChart = await DietChart.findById(dietChartId)
        if(!dietChart) {
            throw new ApiError(404, "Diet chart doesn't exists")
        }

        // check if user is manager
        if(!(req.user.role === "manager")) {
            throw new ApiError(403, "You are not authorized to delete diet chart")
        }
    
        // delete the diet chart
        await DietChart.findByIdAndDelete(dietChartId)
    
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Successfully deleted diet chart!",
            )
        )
    } catch (error) {
        console.log("Error while deleting diet chart : ", error);
        throw new ApiError(500, "Internal server error while deleting diet chart")
    }
})

const getDietChart = asyncHandler(async (req, res) => {
    try {
        // get dietChartId from params
        const {dietChartId} = req.params
        if(!dietChartId) {
            throw new ApiError(400, "Diet chart id is required")
        }
    
        // check if this diet chart exists in db
        const dietChart = await DietChart.findById(dietChartId)
        if(!dietChart) {
            throw new ApiError(404, "Diet chart doesn't exists")
        }
    
        // check if user is manager or pantry
        if(!(req.user.role === "manager" || req.user.role === "pantry")) {
            throw new ApiError(403, "You are not authorized to fetch diet chart")
        }
    
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                dietChart,
                "Diet chart fetched successfully",
            )
        )
    } catch (error) {
        console.log("Error while fetching the diet chart : ", error);
        throw new ApiError(500, "Internal server error while fetching diet chart")
    }

})

const haveDietChart = asyncHandler(async (req,res) => {
    // get patient id
    const {patientId} = req.params

    // check if patient exists
    const patient = await Patient.findById(patientId)
    if(!patient) {
        throw new ApiError(404, "Patient doesn't exists")
    }

    // check if patient has diet chart
    const dietChart = await DietChart.findOne({patient: patientId})
    if(!dietChart) {
        return res.status(200).json(new ApiResponse(200, false, "Patient doesn't have diet chart"))
    } else {
        return res.status(200).json(new ApiResponse(200, dietChart, "Patient has diet chart"))
    }
})


export {
    addPatient,
    removePateint,
    getPatient,
    updatePatient,
    createDietChart,
    updateDietChart,
    getDietChart,
    deleteDietChart,
    getAllPatients,
    haveDietChart
}