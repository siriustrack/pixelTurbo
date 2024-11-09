import { Router } from "express";
import LeadController from "../controllers/lead";
import { body } from "express-validator";

const router = Router();

const leadValidation = [
  body("domain_id").isUUID().withMessage("ID de domínio inválido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("name").optional().isString(),
  body("first_name").optional().isString(),
  body("last_name").optional().isString(),
  body("phone").optional().isString(),
  body("ip").optional().isIP(),
  body("user_agent").optional().isString(),
  body("city").optional().isString(),
  body("state").optional().isString(),
  body("zipcode").optional().isString(),
  body("country_name").optional().isString(),
  body("country_code").optional().isString(),
  body("fbc").optional().isString(),
  body("fbp").optional().isString(),
  body("utm_source").optional().isString(),
  body("utm_medium").optional().isString(),
  body("utm_campaign").optional().isString(),
  body("utm_id").optional().isString(),
  body("utm_term").optional().isString(),
  body("utm_content").optional().isString(),
  body("first_utm_source").optional().isString(),
  body("first_utm_medium").optional().isString(),
  body("first_utm_campaign").optional().isString(),
  body("first_utm_id").optional().isString(),
  body("first_utm_term").optional().isString(),
  body("first_utm_content").optional().isString(),
];

router.post("/", leadValidation, LeadController.create);
router.get("/", LeadController.getAll);
router.get("/:id", LeadController.getById);
router.get("/domain/:domainId", LeadController.getByDomainId);
router.put("/:id", leadValidation, LeadController.update);
router.delete("/:id", LeadController.delete);

export default router;
