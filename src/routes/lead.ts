import { Router } from "express";
import LeadController from "../controllers/lead";
import { body } from "express-validator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management and tracking endpoints
 */

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     description: Register a new lead with their information and tracking data
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domain_id
 *               - email
 *             properties:
 *               domain_id:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               ip:
 *                 type: string
 *                 format: ipv4
 *               user_agent:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               country_name:
 *                 type: string
 *               country_code:
 *                 type: string
 *               utm_source:
 *                 type: string
 *               utm_medium:
 *                 type: string
 *               utm_campaign:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post(
  "/",
  [
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
  ],
  LeadController.create
);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get lead by ID
 *     description: Retrieve detailed information about a specific lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lead UUID
 *     responses:
 *       200:
 *         description: Lead details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
router.get("/:id", LeadController.getById);

/**
 * @swagger
 * /leads/domain/{domainId}:
 *   get:
 *     summary: Get leads by domain
 *     description: Retrieve all leads associated with a specific domain
 *     tags: [Leads]
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
 *         description: List of leads for the domain
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Domain not found
 */
router.get("/domain/:domainId", LeadController.getByDomainId);

export default router;
