import express from "express";
import { body, param } from "express-validator";
import DomainController from "../controllers/domain";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// Rota para criar um novo domínio
router.post(
  "/",
  // Rota protegida por autenticação
  [
    body("domain_name")
      .notEmpty()
      .withMessage("O nome do domínio é obrigatório")
      .isURL()
      .withMessage("URL inválida"),
    // Adicione outras validações conforme necessário
  ],
  DomainController.create
);

// Rota para obter todos os domínios
router.get(
  "/",
  // Rota protegida por autenticação
  DomainController.getAll
);

// Rota para obter um domínio específico por ID
router.get(
  "/:id",
  // Rota protegida por autenticação
  [param("id").notEmpty().withMessage("ID é obrigatório")],
  DomainController.getById
);

// Rota para atualizar um domínio específico por ID
router.put(
  "/:id",
  // Rota protegida por autenticação
  [
    param("id").notEmpty().withMessage("ID é obrigatório"),
    body("domain_name").optional().isURL().withMessage("URL inválida"),
    // Adicione outras validações conforme necessário
  ],
  DomainController.update
);

// Rota para deletar um domínio específico por ID
router.delete(
  "/:id",
  // Rota protegida por autenticação
  [param("id").notEmpty().withMessage("ID é obrigatório")],
  DomainController.delete
);

export default router;
