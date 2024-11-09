import { Router } from "express";
import EventController from "../controllers/event";
import { body } from "express-validator";

const router = Router();

const eventValidation = [
  body("event_name").isString().withMessage("Nome do evento é obrigatório"),
  body("event_time")
    .isISO8601()
    .toDate()
    .withMessage("Tempo do evento é obrigatório e deve ser uma data válida"),
  body("event_source_url")
    .isURL()
    .withMessage(
      "URL de origem do evento é obrigatória e deve ser uma URL válida"
    ),
  body("currency").optional().isString(),
  body("value").optional().isNumeric(),
];

router.post("/", eventValidation, EventController.create);
router.get("/", EventController.getAll);
router.get("/:id", EventController.getById);
router.put("/:id", eventValidation, EventController.update);
router.delete("/:id", EventController.delete);

export default router;
