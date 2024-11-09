import { Router } from "express";
import ConversionController from "../controllers/conversion";
import { body } from "express-validator";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversion:
 *       type: object
 *       required:
 *         - title
 *         - scope
 *         - scope_value
 *         - trigger
 *         - event_name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID for the conversion
 *         domain_id:
 *           type: string
 *           format: uuid
 *           description: ID of the associated domain
 *         title:
 *           type: string
 *           description: Title of the conversion
 *         scope:
 *           type: string
 *           enum: [website, specific_page, regex]
 *           description: Scope of the conversion
 *         scope_value:
 *           type: string
 *           description: Value for the scope (e.g., URL pattern)
 *         trigger:
 *           type: string
 *           enum: [page_access, time_on_page, video_time, form_submit, click, view, hover, scroll]
 *           description: Trigger type for the conversion
 *         trigger_value:
 *           type: string
 *           description: Optional value for the trigger
 *         event_name:
 *           type: string
 *           description: Name of the event to be triggered
 *         product_name:
 *           type: string
 *           description: Optional product name
 *         product_id:
 *           type: string
 *           description: Optional product ID
 *         offer_ids:
 *           type: string
 *           description: Optional offer IDs
 *         product_value:
 *           type: number
 *           description: Optional product value
 *         currency:
 *           type: string
 *           description: Optional currency code
 *         active:
 *           type: boolean
 *           description: Whether the conversion is active
 */

/**
 * @swagger
 * /conversions:
 *   post:
 *     summary: Create a new conversion
 *     tags: [Conversions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conversion'
 *     responses:
 *       201:
 *         description: Conversion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversion'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("O título é obrigatório"),
    body("scope")
      .isIn(["website", "specific_page", "regex"])
      .withMessage("Escopo inválido"),
    body("scope_value")
      .notEmpty()
      .withMessage("O valor do escopo é obrigatório"),
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
    body("event_name").notEmpty().withMessage("O nome do evento é obrigatório"),
  ],
  ConversionController.create
);

/**
 * @swagger
 * /conversions:
 *   get:
 *     summary: Retrieve all conversions
 *     tags: [Conversions]
 *     responses:
 *       200:
 *         description: List of conversions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversion'
 *       401:
 *         description: Unauthorized
 */
router.get("/", ConversionController.getAll);

/**
 * @swagger
 * /conversions/{id}:
 *   get:
 *     summary: Get a conversion by ID
 *     tags: [Conversions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Conversion ID
 *     responses:
 *       200:
 *         description: Conversion details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversion'
 *       404:
 *         description: Conversion not found
 */
router.get("/:id", ConversionController.getById);

/**
 * @swagger
 * /conversions/domain/{domainId}:
 *   get:
 *     summary: Get conversions by domain ID
 *     tags: [Conversions]
 *     parameters:
 *       - in: path
 *         name: domainId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Domain ID
 *     responses:
 *       200:
 *         description: List of conversions for the domain
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversion'
 */
router.get("/domain/:domainId", ConversionController.getByDomainId);

/**
 * @swagger
 * /conversions/{id}:
 *   put:
 *     summary: Update a conversion
 *     tags: [Conversions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conversion'
 *     responses:
 *       200:
 *         description: Conversion updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Conversion not found
 */
router.put(
  "/:id",
  [
    body("title").optional().notEmpty(),
    body("scope").optional().isIn(["website", "specific_page", "regex"]),
    body("trigger")
      .optional()
      .isIn([
        "page_access",
        "time_on_page",
        "video_time",
        "form_submit",
        "click",
        "view",
        "hover",
        "scroll",
      ]),
  ],
  ConversionController.update
);

/**
 * @swagger
 * /conversions/{id}:
 *   delete:
 *     summary: Delete a conversion
 *     tags: [Conversions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Conversion deleted successfully
 *       404:
 *         description: Conversion not found
 */
router.delete("/:id", ConversionController.delete);

export default router;
