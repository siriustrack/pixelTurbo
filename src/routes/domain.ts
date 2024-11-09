import express from "express";
import { body, param } from "express-validator";
import DomainController from "../controllers/domain";
import authMiddleware from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: Domain management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Domain:
 *       type: object
 *       required:
 *         - domain_name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID for the domain
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID of the domain owner
 *         domain_name:
 *           type: string
 *           description: Valid domain URL (e.g., example.com)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Domain creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Domain last update timestamp
 *     DomainResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Domain'
 *         - type: object
 *           properties:
 *             pixels:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FacebookPixel'
 *             conversions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversion'
 */

/**
 * @swagger
 * /domains:
 *   post:
 *     summary: Create a new domain
 *     description: Add a new domain to the system. Requires authentication.
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domain_name
 *             properties:
 *               domain_name:
 *                 type: string
 *                 format: url
 *                 example: example.com
 *     responses:
 *       201:
 *         description: Domain created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domain'
 *       400:
 *         description: Invalid domain name or validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       409:
 *         description: Domain already exists
 */
router.post(
  "/",
  authMiddleware,
  [
    body("domain_name")
      .notEmpty()
      .withMessage("O nome do domínio é obrigatório")
      .isURL()
      .withMessage("URL inválida"),
  ],
  DomainController.create
);

/**
 * @swagger
 * /domains:
 *   get:
 *     summary: Get all domains
 *     description: Retrieve all domains accessible to the authenticated user
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of domains
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DomainResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     current:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get("/", authMiddleware, DomainController.getAll);

/**
 * @swagger
 * /domains/{id}:
 *   get:
 *     summary: Get domain by ID
 *     description: Retrieve detailed information about a specific domain
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Domain UUID
 *     responses:
 *       200:
 *         description: Domain details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Domain not found
 */
router.get(
  "/:id",
  authMiddleware,
  [param("id").notEmpty().withMessage("ID é obrigatório")],
  DomainController.getById
);

/**
 * @swagger
 * /domains/{id}:
 *   put:
 *     summary: Update domain
 *     description: Update an existing domain's information
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Domain UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain_name:
 *                 type: string
 *                 format: url
 *                 example: updated-example.com
 *     responses:
 *       200:
 *         description: Domain updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domain'
 *       400:
 *         description: Invalid domain name or validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Domain not found
 *       409:
 *         description: Domain name already exists
 */
router.put(
  "/:id",
  authMiddleware,
  [
    param("id").notEmpty().withMessage("ID é obrigatório"),
    body("domain_name").optional().isURL().withMessage("URL inválida"),
  ],
  DomainController.update
);

/**
 * @swagger
 * /domains/{id}:
 *   delete:
 *     summary: Delete domain
 *     description: Remove a domain and all associated data
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Domain UUID
 *     responses:
 *       204:
 *         description: Domain deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Domain not found
 */
router.delete(
  "/:id",
  authMiddleware,
  [param("id").notEmpty().withMessage("ID é obrigatório")],
  DomainController.delete
);

export default router;
