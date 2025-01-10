import { Router } from "express";
import { addPatient, removePateint, getPatient, updatePatient, createDietChart, updateDietChart, getDietChart, deleteDietChart, getAllPatients, haveDietChart } from "../controllers/manager.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();
router.use(authenticate);

router.route("/add-patient").post(addPatient)
router.route("/get-all-patients").get(getAllPatients)
router.route("/get-patient/:patientId").get(getPatient)
router.route("/remove-patient/:patientId").delete(removePateint)
router.route("/update-patient/:patientId").post(updatePatient)
router.route("/create-diet-chart/:patientId").post(createDietChart)
router.route("/get-diet-chart/:dietChartId").get(getDietChart)
router.route("/update-diet-chart/:dietChartId").post(updateDietChart)
router.route("/delete-diet-chart/:dietChartId").delete(deleteDietChart)
router.route("/have-diet-chart/:patientId").get(haveDietChart)

export default router