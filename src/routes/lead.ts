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
 *   /lead:
 *    post:
 *      summary: Create a new lead
 *      description: Register a new lead with their information and tracking data.
 *      tags: [Leads]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - domain_id
 *                - email
 *              properties:
 *                domain_id:
 *                  type: string
 *                  format: uuid
 *                  description: "Identifier of the domain associated with the lead"
 *                email:
 *                  type: string
 *                  format: email
 *                  description: "Email of the lead"
 *                name:
 *                  type: string
 *                  description: "Full name of the lead"
 *                first_name:
 *                  type: string
 *                  description: "First name of the lead"
 *                last_name:
 *                  type: string
 *                  description: "Last name of the lead"
 *                phone:
 *                  type: string
 *                  description: "Phone number of the lead"
 *                ip:
 *                  type: string
 *                  format: ipv4
 *                  description: "IP address of the lead"
 *                user_agent:
 *                  type: string
 *                  description: "User agent of the lead's device"
 *                city:
 *                  type: string
 *                  description: "City of the lead"
 *                state:
 *                  type: string
 *                  description: "State of the lead"
 *                zipcode:
 *                  type: string
 *                  description: "ZIP code of the lead"
 *                country_name:
 *                  type: string
 *                  description: "Country name of the lead"
 *                country_code:
 *                  type: string
 *                  description: "Country code of the lead"
 *                fbc:
 *                  type: string
 *                  description: "Facebook click ID (fbc)"
 *                first_fbc:
 *                  type: string
 *                  description: "Facebook click ID (fbc)"
 *                fbp:
 *                  type: string
 *                  description: "Facebook pixel ID (fbp)"
 *                utm_source:
 *                  type: string
 *                  description: "UTM source for tracking"
 *                utm_medium:
 *                  type: string
 *                  description: "UTM medium for tracking"
 *                utm_campaign:
 *                  type: string
 *                  description: "UTM campaign for tracking"
 *                utm_id:
 *                  type: string
 *                  description: "UTM ID for tracking"
 *                utm_term:
 *                  type: string
 *                  description: "UTM term for tracking"
 *                utm_content:
 *                  type: string
 *                  description: "UTM content for tracking"
 *                first_utm_source:
 *                  type: string
 *                  description: "First UTM source"
 *                first_utm_medium:
 *                  type: string
 *                  description: "First UTM medium"
 *                first_utm_campaign:
 *                  type: string
 *                  description: "First UTM campaign"
 *                first_utm_id:
 *                  type: string
 *                  description: "First UTM ID"
 *                first_utm_term:
 *                  type: string
 *                  description: "First UTM term"
 *                first_utm_content:
 *                  type: string
 *                  description: "First UTM content"
 *                gender:
 *                  type: string
 *                  description: "Gender of the lead"
 *                dob:
 *                  type: string
 *                  description: "Date of birth of the lead"
 *                external_id:
 *                  type: string
 *                  description: "External identifier for the lead"
 *      responses:
 *        201:
 *          description: Lead created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Lead'
 *        400:
 *          description: Invalid input data
 *        401:
 *          description: Unauthorized
 *        422:
 *          description: Validation error
 */
router.post(
  "/",
  [
    body("domain_id").isUUID().withMessage("ID de domínio inválido"),
    body("email").optional().isEmail().withMessage("Email inválido"),
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
    body("first_fbc").optional().isString(),
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
    body("gender").optional().isString(),
    body("dob").optional().isString(),
    body("external_id").optional().isString(),
  ],
  LeadController.create
);

/**
 * @swagger
 * /lead/{id}:
 *    get:
 *      summary: Get lead by ID
 *      description: Retrieve detailed information about a specific lead.
 *      tags: [Leads]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: Lead UUID
 *      responses:
 *        200:
 *          description: Lead details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Lead'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Lead not found
 */
router.get("/:id", LeadController.getById);

/**
 * @swagger
 *   /lead/domain/{domainId}:
 *    get:
 *      summary: Get leads by domain
 *      description: Retrieve all leads associated with a specific domain.
 *      tags: [Leads]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: domainId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: Domain UUID
 *      responses:
 *        200:
 *          description: List of leads for the domain
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Lead'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Domain not found
 *
 */
router.get("/domain/:domainId", LeadController.getByDomainId);

export default router;
