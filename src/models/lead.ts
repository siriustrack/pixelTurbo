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

    // Primeira etapa: Verificar se o lead já existe
    const existingLead = await this.getById(id);

    // Query de inserção
    const insertQuery = `
      INSERT INTO Lead (id, domain_id, name, first_name, last_name, email, phone, ip, user_agent, city, state, zipcode, country_name, country_code, first_fbc, fbc, fbp, utm_source, utm_medium, utm_campaign, utm_id, utm_term, utm_content, first_utm_source, first_utm_medium, first_utm_campaign, first_utm_id, first_utm_term, first_utm_content, gender, dob, external_id, created_at, updated_at)
      VALUES ('${id}', '${domain_id}', '${name}', '${first_name}', '${last_name}', '${email}', '${phone}', '${ip}', '${user_agent}', '${city}', '${state}', '${zipcode}', '${country_name}', '${country_code}', '${first_fbc}', '${fbc}', '${fbp}', '${utm_source}', '${utm_medium}', '${utm_campaign}', '${utm_id}', '${utm_term}', '${utm_content}', '${first_utm_source}', '${first_utm_medium}', '${first_utm_campaign}', '${first_utm_id}', '${first_utm_term}', '${first_utm_content}', '${gender}', '${dob}', '${external_id}', '${now}', '${now}')
    `;

    // Query de atualização
    const updateQuery = `
      ALTER TABLE Lead UPDATE
        domain_id = '${domain_id}',
        name = '${name}',
        first_name = '${first_name}',
        last_name = '${last_name}',
        email = '${email}',
        phone = '${phone}',
        ip = '${ip}',
        user_agent = '${user_agent}',
        city = '${city}',
        state = '${state}',
        zipcode = '${zipcode}',
        country_name = '${country_name}',
        country_code = '${country_code}',
        first_fbc = '${first_fbc}',
        fbc = '${fbc}',
        fbp = '${fbp}',
        utm_source = '${utm_source}',
        utm_medium = '${utm_medium}',
        utm_campaign = '${utm_campaign}',
        utm_id = '${utm_id}',
        utm_term = '${utm_term}',
        utm_content = '${utm_content}',
        first_utm_source = '${first_utm_source}',
        first_utm_medium = '${first_utm_medium}',
        first_utm_campaign = '${first_utm_campaign}',
        first_utm_id = '${first_utm_id}',
        first_utm_term = '${first_utm_term}',
        first_utm_content = '${first_utm_content}',
        gender = '${gender}',
        dob = '${dob}',
        external_id = '${external_id}',
        updated_at = '${now}'
      WHERE id = '${id}'
    `;

    try {
      if (existingLead) {
        // Se o lead já existe, execute a query de atualização
        await clickhouseClient.query({ query: updateQuery });
      } else {
        // Caso contrário, insira o novo lead
        await clickhouseClient.query({ query: insertQuery });
      }
      // Verifique se o lead foi criado ou atualizado
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
    const query = `SELECT * FROM Lead WHERE id = '${id}'`;

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
}

export default new LeadModel();
