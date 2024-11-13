import { Router } from "express";
import FacebookApiRequestController from "../controllers/facebookApiRequest";

const router = Router();

router.post("/send-event", FacebookApiRequestController.sendEvent);

export default router;
