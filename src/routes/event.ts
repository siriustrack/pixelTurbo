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
 *               - event_url
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *               lead_id:
 *                 type: string
 *                 format: uuid
 *               event_name:
 *                 type: string
 *                 example: "purchase"
 *               event_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T12:00:00Z"
 *               event_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/checkout"
 *               page_id:
 *                 type: string
 *                 format: uuid
 *               page_title:
 *                 type: string
 *               product_id:
 *                 type: string
 *                 format: uuid
 *               product_name:
 *                 type: string
 *               product_value:
 *                 type: number
 *               predicted_ltv:
 *                 type: number
 *               offer_ids:
 *                 type: string
 *               content_name:
 *                 type: string
 *               traffic_source:
 *                 type: string
 *               utm_source:
 *                 type: string
 *               utm_medium:
 *                 type: string
 *               utm_campaign:
 *                 type: string
 *               utm_id:
 *                 type: string
 *               utm_term:
 *                 type: string
 *               utm_content:
 *                 type: string
 *               src:
 *                 type: string
 *               sck:
 *                 type: string
 *               geo_ip:
 *                 type: string
 *               geo_device:
 *                 type: string
 *               geo_country:
 *                 type: string
 *               geo_state:
 *                 type: string
 *               geo_city:
 *                 type: string
 *               geo_zipcode:
 *                 type: string
 *               geo_currency:
 *                 type: string
 *               first_fbc:
 *                 type: string
 *               fbc:
 *                 type: string
 *               fbp:
 *                 type: string
 *               domain_id:
 *                 type: string
 *                 format: uuid
 *               content_ids:
 *                 type: string
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               value:
 *                 type: number
 *                 example: 99.99
 *               facebook_request:
 *                 type: string
 *               facebook_response:
 *                 type: string
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
    body("event_url")
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
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get("/:id", EventController.getById);

/**
 * @swagger
 * /events/domain/{domain_id}:
 *   get:
 *     summary: Get events by Domain ID
 *     description: Retrieve all events associated with a specific domain_id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: domain_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Domain UUID
 *     responses:
 *       200:
 *         description: List of events for the given domain_id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: Events not found for the given domain_id
 */
router.get("/domain/:domain_id", EventController.getByDomainId);

export default router;
