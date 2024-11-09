import { QueryResult } from "pg";
import { pool } from "../utils/pgdb";
import { Domain } from "../types";
import { v4 as uuidv4 } from "uuid";
import { DNS } from "@google-cloud/dns";

const dnsClient = new DNS();
class DomainModel {
  async create(domain: Domain): Promise<Domain> {
    const { user_id, domain_name } = domain;
    const id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();

    const query = `
      INSERT INTO domains (id, user_id, domain_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [id, user_id, domain_name, created_at, updated_at];

    try {
      const result: QueryResult<Domain> = await pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      if (
        error.code === "23505" &&
        error.constraint === "domains_domain_name_key"
      ) {
        console.error("Domínio duplicado:", error);
        throw new Error("Este domínio já está cadastrado.");
      }
      console.error("Erro ao criar domínio:", error);
      throw new Error("Erro ao criar domínio.");
    }
  }

  async getAll(): Promise<Domain[]> {
    const query = "SELECT * FROM domains;";

    try {
      const result: QueryResult<Domain> = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar todos os domínios:", error);
      throw new Error("Erro ao buscar todos os domínios");
    }
  }
  async getById(id: string, userId: string): Promise<Domain | null> {
    const query = `SELECT * FROM domains WHERE id = $1 AND user_id = $2`;

    try {
      const result: QueryResult<Domain> = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar domínio por ID e user_id:", error);
      throw new Error("Erro ao buscar domínio por ID e user_id");
    }
  }

  async getByUserId(userId: string): Promise<Domain[]> {
    const query = `SELECT * FROM domains WHERE user_id = $1`;

    try {
      const result: QueryResult<Domain> = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar domínios por ID do usuário:", error);
      throw new Error("Erro ao buscar domínios por ID do usuário");
    }
  }

  async getByDomainName(domainName: string): Promise<Domain | null> {
    const query = `SELECT * FROM domains WHERE domain_name = $1`;

    try {
      const result: QueryResult<Domain> = await pool.query(query, [domainName]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar domínio por nome:", error);
      throw new Error("Erro ao buscar domínio por nome");
    }
  }

  async update(id: string, domain: Domain): Promise<Domain | null> {
    const { user_id, domain_name } = domain;
    const updated_at = new Date();
    const query = `
      UPDATE domains
      SET user_id = $1, domain_name = $2, updated_at = $3
      WHERE id = $4 AND user_id = $1
      RETURNING *;
    `;
    const values = [user_id, domain_name, updated_at, id];

    try {
      const result: QueryResult<Domain> = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar domínio:", error);
      throw new Error("Erro ao atualizar domínio");
    }
  }

  async delete(id: string, user_id: string): Promise<boolean> {
    const query = "DELETE FROM domains WHERE id = $1 AND user_id = $2;";

    try {
      await pool.query(query, [id, user_id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar domínio:", error);
      throw new Error("Erro ao deletar domínio");
    }
  }
  async validateCname(domainId: string, userId: string): Promise<boolean> {
    const query = `SELECT * FROM domains WHERE id = $1 AND user_id = $2`;

    try {
      // Busca o domínio no banco de dados para verificar sua existência
      const result: QueryResult<Domain> = await pool.query(query, [
        domainId,
        userId,
      ]);

      // Verifica se o domínio foi encontrado
      if (!result.rows || result.rows.length === 0) {
        throw new Error("Domínio não encontrado ou usuário não autorizado.");
      }

      const domain = result.rows[0];
      const cnameRecord = `pxt.${domain.domain_name}`;
      const expectedTarget = process.env.PROXY_SERVER || "";

      // Verifica o registro CNAME usando Google Cloud DNS
      const [zones] = await dnsClient.getZones();
      let cnameTarget = "";

      // Procura pelo registro CNAME nos zones
      for (const zone of zones) {
        const [records] = await zone.getRecords({
          type: "CNAME",
          name: cnameRecord,
        });

        // Se encontrar registros, obtém o valor do CNAME
        if (
          records &&
          records.length > 0 &&
          records[0].data &&
          records[0].data.length > 0
        ) {
          cnameTarget = records[0].data[0];
          break;
        }
      }

      // Verifica se o CNAME está apontando para o valor esperado
      if (cnameTarget === expectedTarget) {
        // Atualiza o campo is_validated para true se o CNAME estiver correto
        const updateQuery = `
          UPDATE domains
          SET is_validated = true, updated_at = $1
          WHERE id = $2 AND user_id = $3
          RETURNING *;
        `;
        const updatedResult: QueryResult<Domain> = await pool.query(
          updateQuery,
          [new Date(), domainId, userId]
        );

        return updatedResult.rowCount !== null && updatedResult.rowCount > 0;
      } else {
        throw new Error("CNAME não aponta para o destino esperado.");
      }
    } catch (error) {
      console.error("Erro ao validar CNAME do domínio:", error);
      throw new Error("Erro ao validar CNAME do domínio.");
    }
  }
}

export default new DomainModel();
