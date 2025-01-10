import mongoose, {Schema} from "mongoose";

const deliverySchema = new Schema(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
        dietChart: {
            type: Schema.Types.ObjectId,
            ref: 'DietChart',
            required: true
        },
        deliveryDate: {
            type: String,
            required: true
        },
        morningMealStatus: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        eveningMealStatus: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        nightMealStatus: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        deliveryNotes: {
            type: [String],
            default: []
        }
    },
    {timestamps: true}
)

export const Delivery = mongoose.model("Delivery", deliverySchema);