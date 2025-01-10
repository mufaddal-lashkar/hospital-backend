import {Patient} from "../models/patient.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { DietChart } from "../models/dietChart.model.js"
import { Delivery } from "../models/delivery.model.js"

const getAllDietCharts = asyncHandler(async (req, res) => {
    try {        
        // check if user is pantry 
        if(!(req.user.role === "pantry")) {
            throw new ApiError(403, "You are not authorized to get all diet charts")
        }
    
        // fetch all diet chart
        const dietCharts = await DietChart.find().populate("patient")
        if(dietCharts.length === 0) {
            return res.status(200).json(new ApiResponse(200, "No diet charts available"))
        }
    
        // return res
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                dietCharts,
                "Diets charts fetched successfully"
            )
        )
    } catch (error) {
        console.log("Error while fetching all diet charts");
        throw new ApiError(500, "Internal server error while fetching all diet charts")
    }
    
})

const createDelivery = asyncHandler(async (req, res) => {
    try {
        // get patientId and dietChartId from params
        const { patientId, dietChartId } = req.params
        if(!patientId || !dietChartId) {
            throw new ApiError(400, "Patient ID and diet chart ID are required")
        }

        // check if patient exists
        const patient = await Patient.findById(patientId)
        if(!patient) {
            throw new ApiError(404, "Patient not found")
        }

        // check if diet chart exists
        const dietChart = await DietChart.findById(dietChartId)
        if(!dietChart) {
            throw new ApiError(404, "Diet chart not found")
        }

        // get data from body
        const {deliveryDate, deliveryNotes} = req.body
        if(!deliveryDate) {
            throw new ApiError(400, "Provide delivery date")
        }

        // create new delivery
        const delivery = new Delivery({
            patient: patientId,
            dietChart: dietChartId,
            deliveryDate,
            deliveryNotes: deliveryNotes || [],
        })
        await delivery.save()

        // return res
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                delivery,
                "Delivery created successfully",
            )
        )
    } catch (error) {
        console.log("Error while creating delivery : ", error);
        throw new ApiError(500, "Internal server error while creating delivery")
    }
})

export {
    getAllDietCharts,
    createDelivery
}