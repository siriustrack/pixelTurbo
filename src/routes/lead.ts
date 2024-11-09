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
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       required:
 *         - domain_id
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID for the lead
 *         domain_id:
 *           type: string
 *           format: uuid
 *           description: Associated domain ID
 *         name:
 *           type: string
 *           description: Full name of the lead
 *         first_name:
 *           type: string
 *           description: First name
 *         last_name:
 *           type: string
 *           description: Last name
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         phone:
 *           type: string
 *           description: Phone number
 *         ip:
 *           type: string
 *           format: ipv4
 *           description: IP address
 *         user_agent:
 *           type: string
 *           description: Browser user agent
 *         city:
 *           type: string
 *           description: City location
 *         state:
 *           type: string
 *           description: State/province
 *         zipcode:
 *           type: string
 *           description: Postal code
 *         country_name:
 *           type: string
 *           description: Country name
 *         country_code:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *           description: ISO country code
 *         fbc:
 *           type: string
 *           description: Facebook click identifier
 *         fbp:
 *           type: string
 *           description: Facebook browser identifier
 *         utm_source:
 *           type: string
 *           description: UTM source parameter
 *         utm_medium:
 *           type: string
 *           description: UTM medium parameter
 *         utm_campaign:
 *           type: string
 *           description: UTM campaign parameter
 *         utm_id:
 *           type: string
 *           description: UTM ID parameter
 *         utm_term:
 *           type: string
 *           description: UTM term parameter
 *         utm_content:
 *           type: string
 *           description: UTM content parameter
 *         first_utm_source:
 *           type: string
 *           description: First touch UTM source
 *         first_utm_medium:
 *           type: string
 *           description: First touch UTM medium
 *         first_utm_campaign:
 *           type: string
 *           description: First touch UTM campaign
 *         first_utm_id:
 *           type: string
 *           description: First touch UTM ID
 *         first_utm_term:
 *           type: string
 *           description: First touch UTM term
 *         first_utm_content:
 *           type: string
 *           description: First touch UTM content
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Lead creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Lead last update timestamp
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
 * /leads:
 *   get:
 *     summary: Get all leads
 *     description: Retrieve a list of all leads with optional filtering
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
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
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email address
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created after this date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created before this date
 *     responses:
 *       200:
 *         description: List of leads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
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
 *         description: Unauthorized
 */
router.get("/", LeadController.getAll);

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

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Update lead
 *     description: Update an existing lead's information
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 *       422:
 *         description: Validation error
 */
router.put(
  "/:id",
  [
    body("domain_id").optional().isUUID(),
    body("email").optional().isEmail(),
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
  ],
  LeadController.update
);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Delete lead
 *     description: Remove a lead from the system
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
 *       204:
 *         description: Lead deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
router.delete("/:id", LeadController.delete);

export default router;
