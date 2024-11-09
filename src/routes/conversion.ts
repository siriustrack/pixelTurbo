import { Router } from "express";
import ConversionController from "../controllers/conversion";
import { body } from "express-validator";

const router = Router();

const conversionValidation = [
  body("domain_id").optional().isUUID(),
  body("title").notEmpty().withMessage("O título é obrigatório"),
  body("scope")
    .isIn(["website", "specific_page", "regex"])
    .withMessage("Escopo inválido"),
  body("scope_value").notEmpty().withMessage("O valor do escopo é obrigatório"),
  body("trigger")
    .isIn([
      "page_access",
      "time_on_page",
      "video_time",
      "form_submit",
      "click",
      "view",
      "hover",
      "scroll",
    ])
    .withMessage("Gatilho inválido"),
  body("trigger_value").optional(),
  body("event_name").notEmpty().withMessage("O nome do evento é obrigatório"),
  body("product_name").optional(),
  body("product_id").optional(),
  body("offer_ids").optional(),
  body("product_value").optional().isNumeric(),
  body("currency").optional(),
  body("active").optional().isBoolean(),
];

router.post("/", conversionValidation, ConversionController.create);
router.get("/", ConversionController.getAll);
router.get("/:id", ConversionController.getById);
router.get("/domain/:domainId", ConversionController.getByDomainId);
router.put("/:id", conversionValidation, ConversionController.update);
router.delete("/:id", ConversionController.delete);

export default router;
