import { Router } from "express";
import EventController from "../controllers/event";
import { body } from "express-validator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event tracking and management endpoints
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Track a new event with associated data
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_name
 *               - event_time
 *               - event_source_url
 *             properties:
 *               event_name:
 *                 type: string
 *                 example: "purchase"
 *               event_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T12:00:00Z"
 *               event_source_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/checkout"
 *               lead_id:
 *                 type: string
 *                 format: uuid
 *               domain_id:
 *                 type: string
 *                 format: uuid
 *               content_ids:
 *                 type: string
 *                 example: "prod123,prod456"
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               value:
 *                 type: number
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *       422:
 *         description: Validation error
 */
router.post(
  "/",
  [
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
  ],
  EventController.create
);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     description: Retrieve detailed information about a specific event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event UUID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get("/:id", EventController.getById);

export default router;
