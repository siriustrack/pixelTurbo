import clickhouseClient from "../utils/chdb";
import { Lead } from "../types";
import { v4 as uuidv4 } from "uuid";

class LeadModel {
  async create(lead: Lead): Promise<Lead> {
    try {
      // Generate ID if not provided
      const id = lead.id || uuidv4();
      const now = new Date();

      // Try to get existing lead
      const existingLead = await this.getById(id);

      // Prepare the final lead data
      let finalLead: Lead = {
        ...lead,
        id,
        created_at: now,
        updated_at: now,
      };

      if (existingLead) {
        // Merge existing and new data, keeping non-null values from the new lead
        finalLead = {
          ...existingLead,
          ...Object.fromEntries(
            Object.entries(lead).filter(([_, value]) => value != null)
          ),
          id,
          created_at: existingLead.created_at,
          updated_at: now,
        };

        // Delete existing lead
        const deleteQuery = `
          ALTER TABLE Lead 
          DELETE WHERE id = '${id}'
        `;
        await clickhouseClient.query({ query: deleteQuery });
      }

      // Insert the final lead data
      const insertQuery = `
        INSERT INTO Lead (
          id, domain_id, name, first_name, last_name, email, phone,
          ip, user_agent, city, state, zipcode, country_name, country_code,
          first_fbc, fbc, fbp, utm_source, utm_medium, utm_campaign,
          utm_id, utm_term, utm_content, first_utm_source, first_utm_medium,
          first_utm_campaign, first_utm_id, first_utm_term, first_utm_content,
          gender, dob, external_id, created_at, updated_at
        ) VALUES (
          '${finalLead.id}',
          ${this.formatValue(finalLead.domain_id)},
          ${this.formatValue(finalLead.name)},
          ${this.formatValue(finalLead.first_name)},
          ${this.formatValue(finalLead.last_name)},
          ${this.formatValue(finalLead.email)},
          ${this.formatValue(finalLead.phone)},
          ${this.formatValue(finalLead.ip)},
          ${this.formatValue(finalLead.user_agent)},
          ${this.formatValue(finalLead.city)},
          ${this.formatValue(finalLead.state)},
          ${this.formatValue(finalLead.zipcode)},
          ${this.formatValue(finalLead.country_name)},
          ${this.formatValue(finalLead.country_code)},
          ${this.formatValue(finalLead.first_fbc)},
          ${this.formatValue(finalLead.fbc)},
          ${this.formatValue(finalLead.fbp)},
          ${this.formatValue(finalLead.utm_source)},
          ${this.formatValue(finalLead.utm_medium)},
          ${this.formatValue(finalLead.utm_campaign)},
          ${this.formatValue(finalLead.utm_id)},
          ${this.formatValue(finalLead.utm_term)},
          ${this.formatValue(finalLead.utm_content)},
          ${this.formatValue(finalLead.first_utm_source)},
          ${this.formatValue(finalLead.first_utm_medium)},
          ${this.formatValue(finalLead.first_utm_campaign)},
          ${this.formatValue(finalLead.first_utm_id)},
          ${this.formatValue(finalLead.first_utm_term)},
          ${this.formatValue(finalLead.first_utm_content)},
          ${this.formatValue(finalLead.gender)},
          ${this.formatValue(finalLead.dob)},
          ${this.formatValue(finalLead.external_id)},
          '${finalLead.created_at}',
          '${finalLead.updated_at}'
        )
      `;

      await clickhouseClient.query({ query: insertQuery });

      // Verify and return the created/updated lead
      const createdLead = await this.getById(id);
      if (!createdLead) {
        throw new Error("Lead not found after creation/update");
      }

      return createdLead;
    } catch (error) {
      console.error("Error creating or updating lead:", error);
      throw new Error("Failed to create or update lead");
    }
  }

  // Helper method to format values for SQL query
  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return "NULL";
    }
    return `'${String(value).replace(/'/g, "''")}'`;
  }

  async getById(id: string): Promise<Lead | null> {
    const query = `SELECT * FROM Lead WHERE id = '${id}'`;

    try {
      const result: any = await clickhouseClient
        .query({ query })
        .then((res: { json: () => any }) => res.json());
      return result.length > 0 ? (result[0] as Lead) : null;
    } catch (error) {
      console.error("Error fetching lead by ID:", error);
      throw new Error("Failed to fetch lead by ID");
    }
  }

  async getByDomainId(domainId: string): Promise<Lead[]> {
    const query = `SELECT * FROM Lead WHERE domain_id = '${domainId}'`;

    try {
      const result: any = await clickhouseClient
        .query({ query })
        .then((res: { json: () => any }) => res.json());
      return result as Lead[];
    } catch (error) {
      console.error("Error fetching leads by domain_id:", error);
      throw new Error("Failed to fetch leads by domain_id");
    }
  }
}

export default new LeadModel();
