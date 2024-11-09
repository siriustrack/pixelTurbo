import { Router } from "express";
import FacebookPixelController from "../controllers/facebookPixel";
import { body } from "express-validator";

const router = Router();

// Validações comuns para criação e atualização de Facebook Pixel
const facebookPixelValidation = [
  body("pixel_id").notEmpty().withMessage("O ID do pixel é obrigatório"),
  body("api_token").notEmpty().withMessage("O token da API é obrigatório"),
];

// Rota para criar um novo Facebook Pixel
router.post("/", facebookPixelValidation, FacebookPixelController.create);

// Rota para obter todos os Facebook Pixels
router.get("/", FacebookPixelController.getAll);

// Rota para obter um Facebook Pixel por ID
router.get("/:id", FacebookPixelController.getById);

// Rota para obter Facebook Pixels por ID de domínio
router.get("/domain/:domainId", FacebookPixelController.getByDomainId);

// Rota para atualizar um Facebook Pixel por ID
router.put("/:id", facebookPixelValidation, FacebookPixelController.update);

// Rota para deletar um Facebook Pixel por ID
router.delete("/:id", FacebookPixelController.delete);

export default router;
