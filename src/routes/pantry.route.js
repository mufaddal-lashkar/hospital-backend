import { Router } from "express";
import { getDietChart } from "../controllers/manager.controller.js";
import { createDelivery, getAllDietCharts } from "../controllers/pantry.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router()
router.use(authenticate)

router.route("/get-all-diet-charts").get(getAllDietCharts)
router.route("/create-delivery/:patientId/:dietChartId").post(createDelivery)

export default router
