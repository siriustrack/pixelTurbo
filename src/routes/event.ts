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
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - event_name
 *         - event_time
 *         - event_source_url
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID for the event
 *         lead_id:
 *           type: string
 *           format: uuid
 *           description: Associated lead ID
 *         conversion_id:
 *           type: string
 *           format: uuid
 *           description: Associated conversion ID
 *         domain_id:
 *           type: string
 *           format: uuid
 *           description: Associated domain ID
 *         event_name:
 *           type: string
 *           description: Name of the event
 *         event_time:
 *           type: string
 *           format: date-time
 *           description: When the event occurred
 *         event_source_url:
 *           type: string
 *           format: uri
 *           description: URL where the event occurred
 *         content_ids:
 *           type: string
 *           description: Optional content identifiers
 *         currency:
 *           type: string
 *           minLength: 3
 *           maxLength: 3
 *           description: Currency code (e.g., USD)
 *         value:
 *           type: number
 *           format: float
 *           description: Monetary value of the event
 *         facebook_request:
 *           type: object
 *           description: Facebook API request data
 *         facebook_response:
 *           type: object
 *           description: Facebook API response data
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Event creation timestamp
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
 *               conversion_id:
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
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all tracked events with pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: domain_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by domain ID
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events after this date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events before this date
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
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
 */
router.get("/", EventController.getAll);

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
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get("/:id", EventController.getById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event
 *     description: Update an existing event's information
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_name:
 *                 type: string
 *               event_time:
 *                 type: string
 *                 format: date-time
 *               event_source_url:
 *                 type: string
 *                 format: uri
 *               content_ids:
 *                 type: string
 *               currency:
 *                 type: string
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event not found
 *       422:
 *         description: Validation error
 */
router.put(
  "/:id",
  [
    body("event_name").optional().isString(),
    body("event_time").optional().isISO8601().toDate(),
    body("event_source_url").optional().isURL(),
    body("currency").optional().isString(),
    body("value").optional().isNumeric(),
  ],
  EventController.update
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event
 *     description: Remove an event from the system
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
 *       204:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete("/:id", EventController.delete);

export default router;
