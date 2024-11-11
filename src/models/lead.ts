import clickhouseClient from "../utils/chdb";
import { Lead } from "../types";
import { v4 as uuidv4 } from "uuid";

class LeadModel {
  // Método de upsert: cria ou atualiza um lead com base no ID
  async create(lead: Lead): Promise<Lead> {
    const id = lead.id || uuidv4();
    const now = new Date().toISOString();

    const {
      domain_id,
      name,
      first_name,
      last_name,
      email,
      phone,
      ip,
      user_agent,
      city,
      state,
      zipcode,
      country_name,
      country_code,
      first_fbc,
      fbc,
      fbp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      first_utm_id,
      first_utm_term,
      first_utm_content,
      gender,
      dob,
      external_id,
    } = lead;

    const query = `
      INSERT INTO leads (id, domain_id, name, first_name, last_name, email, phone, ip, user_agent, city, state, zipcode, country_name, country_code, first_fbc, fbc, fbp, utm_source, utm_medium, utm_campaign, utm_id, utm_term, utm_content, first_utm_source, first_utm_medium, first_utm_campaign, first_utm_id, first_utm_term, first_utm_content, gender, dob, external_id, created_at, updated_at)
      VALUES ('${id}', '${domain_id}', '${name}', '${first_name}', '${last_name}', '${email}', '${phone}', '${ip}', '${user_agent}', '${city}', '${state}', '${zipcode}', '${country_name}', '${country_code}', '${first_fbc}', '${fbc}', '${fbp}', '${utm_source}', '${utm_medium}', '${utm_campaign}', '${utm_id}', '${utm_term}', '${utm_content}', '${first_utm_source}', '${first_utm_medium}', '${first_utm_campaign}', '${first_utm_id}', '${first_utm_term}', '${first_utm_content}', '${gender}', '${dob}', '${external_id}', '${now}', '${now}')
      ON DUPLICATE KEY UPDATE
        domain_id = COALESCE('${domain_id}', domain_id),
        name = COALESCE('${name}', name),
        first_name = COALESCE('${first_name}', first_name),
        last_name = COALESCE('${last_name}', last_name),
        email = COALESCE('${email}', email),
        phone = COALESCE('${phone}', phone),
        ip = COALESCE('${ip}', ip),
        user_agent = COALESCE('${user_agent}', user_agent),
        city = COALESCE('${city}', city),
        state = COALESCE('${state}', state),
        zipcode = COALESCE('${zipcode}', zipcode),
        country_name = COALESCE('${country_name}', country_name),
        country_code = COALESCE('${country_code}', country_code),
        first_fbc = COALESCE('${first_fbc}', first_fbc),
        fbc = COALESCE('${fbc}', fbc),
        fbp = COALESCE('${fbp}', fbp),
        utm_source = COALESCE('${utm_source}', utm_source),
        utm_medium = COALESCE('${utm_medium}', utm_medium),
        utm_campaign = COALESCE('${utm_campaign}', utm_campaign),
        utm_id = COALESCE('${utm_id}', utm_id),
        utm_term = COALESCE('${utm_term}', utm_term),
        utm_content = COALESCE('${utm_content}', utm_content),
        first_utm_source = COALESCE('${first_utm_source}', first_utm_source),
        first_utm_medium = COALESCE('${first_utm_medium}', first_utm_medium),
        first_utm_campaign = COALESCE('${first_utm_campaign}', first_utm_campaign),
        first_utm_id = COALESCE('${first_utm_id}', first_utm_id),
        first_utm_term = COALESCE('${first_utm_term}', first_utm_term),
        first_utm_content = COALESCE('${first_utm_content}', first_utm_content),
        gender = COALESCE('${gender}', gender),
        dob = COALESCE('${dob}', dob),
        external_id = COALESCE('${external_id}', external_id),
        updated_at = '${now}'
    `;

    try {
      await clickhouseClient.query({ query });
      const lead = await this.getById(id);
      if (!lead) {
        throw new Error("Lead não encontrado após criação/atualização.");
      }
      return lead;
    } catch (error: any) {
      console.error("Erro ao criar ou atualizar lead:", error);
      throw new Error("Erro ao criar ou atualizar lead.");
    }
  }

  // Método para buscar lead por ID
  async getById(id: string): Promise<Lead | null> {
    const query = `SELECT * FROM leads WHERE id = '${id}'`;

    try {
      const result: any = await clickhouseClient
        .query({ query })
        .then((res: { json: () => any }) => res.json());
      return result.length > 0 ? (result[0] as Lead) : null;
    } catch (error) {
      console.error("Erro ao buscar lead por ID:", error);
      throw new Error("Erro ao buscar lead por ID");
    }
  }

  // Método para buscar leads por domain_id
  async getByDomainId(domainId: string): Promise<Lead[]> {
    const query = `SELECT * FROM leads WHERE domain_id = '${domainId}'`;

    try {
      const result: any = await clickhouseClient
        .query({ query })
        .then((res: { json: () => any }) => res.json());
      return result as Lead[];
    } catch (error) {
      console.error("Erro ao buscar leads por domain_id:", error);
      throw new Error("Erro ao buscar leads por domain_id");
    }
  }
}

export default new LeadModel();
