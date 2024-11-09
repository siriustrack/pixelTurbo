import { Router } from "express";
import { body, ValidationChain } from "express-validator";
import { validateRequest } from "../middleware/validation";
import { authLimiter } from "../middleware/rateLimiter";
import AuthController from "../controllers/auth";
import authMiddleware from "../middleware/auth";

const router = Router();

// Registration validation rules
const registerValidation: ValidationChain[] = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Senha deve ter no mínimo 8 caracteres")
    .matches(/\d/)
    .withMessage("Senha deve conter pelo menos um número")
    .matches(/[A-Z]/)
    .withMessage("Senha deve conter pelo menos uma letra maiúscula"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2 })
    .withMessage("Nome deve ter no mínimo 2 caracteres"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Número de telefone inválido"),
];

// Login validation rules
const loginValidation: ValidationChain[] = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
];

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid input or email already exists
 *       429:
 *         description: Too many requests
 */
router.post(
  "/register",
  authLimiter,
  registerValidation,
  validateRequest,
  AuthController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post(
  "/login",
  authLimiter,
  loginValidation,
  validateRequest,
  AuthController.login
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get("/me", authMiddleware, AuthController.getCurrentUser);

export default router;
