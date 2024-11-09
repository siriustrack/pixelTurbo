import { Router } from "express";
import FacebookPixelController from "../controllers/facebookPixel";
import { body } from "express-validator";
import authMiddleware from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Facebook Pixels
 *   description: Facebook Pixel management and configuration
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FacebookPixel:
 *       type: object
 *       required:
 *         - pixel_id
 *         - api_token
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID for the Facebook Pixel
 *         domain_id:
 *           type: string
 *           format: uuid
 *           description: Associated domain ID
 *         pixel_id:
 *           type: string
 *           description: Facebook Pixel ID from Meta
 *         api_token:
 *           type: string
 *           description: Facebook API access token
 *         test_tag:
 *           type: string
 *           description: Optional test event code
 *         test_tag_active:
 *           type: boolean
 *           description: Whether test mode is enabled
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * /facebook-pixels:
 *   post:
 *     summary: Create Facebook Pixel
 *     description: Add a new Facebook Pixel configuration
 *     tags: [Facebook Pixels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pixel_id
 *               - api_token
 *               - domain_id
 *             properties:
 *               domain_id:
 *                 type: string
 *                 format: uuid
 *               pixel_id:
 *                 type: string
 *                 example: "123456789012345"
 *               api_token:
 *                 type: string
 *                 example: "EAABxxx..."
 *               test_tag:
 *                 type: string
 *                 example: "TEST12345"
 *               test_tag_active:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Facebook Pixel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacebookPixel'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Pixel ID already exists for this domain
 */
router.post(
  "/",
  authMiddleware,
  [
    body("pixel_id").notEmpty().withMessage("O ID do pixel é obrigatório"),
    body("api_token").notEmpty().withMessage("O token da API é obrigatório"),
  ],
  FacebookPixelController.create
);

/**
 * @swagger
 * /facebook-pixels:
 *   get:
 *     summary: Get all Facebook Pixels
 *     description: Retrieve all Facebook Pixel configurations
 *     tags: [Facebook Pixels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: domain_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by domain ID
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of Facebook Pixels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FacebookPixel'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, FacebookPixelController.getAll);

/**
 * @swagger
 * /facebook-pixels/{id}:
 *   get:
 *     summary: Get Facebook Pixel by ID
 *     description: Retrieve a specific Facebook Pixel configuration
 *     tags: [Facebook Pixels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facebook Pixel UUID
 *     responses:
 *       200:
 *         description: Facebook Pixel details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacebookPixel'
 *       404:
 *         description: Facebook Pixel not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, FacebookPixelController.getById);

/**
 * @swagger
 * /facebook-pixels/domain/{domainId}:
 *   get:
 *     summary: Get Facebook Pixels by domain
 *     description: Retrieve all Facebook Pixels for a specific domain
 *     tags: [Facebook Pixels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: domainId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Domain UUID
 *     responses:
 *       200:
 *         description: List of Facebook Pixels for the domain
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FacebookPixel'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/domain/:domainId",
  authMiddleware,
  FacebookPixelController.getByDomainId
);

/**
 * @swagger
 * /facebook-pixels/{id}:
 *   put:
 *     summary: Update Facebook Pixel
 *     description: Update an existing Facebook Pixel configuration
 *     tags: [Facebook Pixels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facebook Pixel UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pixel_id:
 *                 type: string
 *               api_token:
 *                 type: string
 *               test_tag:
 *                 type: string
 *               test_tag_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Facebook Pixel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacebookPixel'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Facebook Pixel not found
 */
router.put(
  "/:id",
  authMiddleware,
  [
    body("pixel_id").optional().notEmpty(),
    body("api_token").optional().notEmpty(),
  ],
  FacebookPixelController.update
);

/**
 * @swagger
 * /facebook-pixels/{id}:
 *   delete:
 *     summary: Delete Facebook Pixel
 *     description: Remove a Facebook Pixel configuration
 *     tags: [Facebook Pixels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facebook Pixel UUID
 *     responses:
 *       204:
 *         description: Facebook Pixel deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Facebook Pixel not found
 */
router.delete("/:id", authMiddleware, FacebookPixelController.delete);

export default router;
