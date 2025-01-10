import mongoose, {Schema} from "mongoose";

const dietChartSchema = new Schema(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
        morningMeal: {
            type: [String],
            required: true,
            default: []
        },
        eveningMeal: {
            type: [String],
            required: true,
            default: []
        },
        nightMeal: {
            type: [String],
            required: true,
            default: []
        },
        ingredients: {
            type: [String],
            default: []
        },
        instructions: {
            type: [String],
            default: []
        }
    },
    {timestamps: true})

export const DietChart = mongoose.model("DietChart", dietChartSchema)