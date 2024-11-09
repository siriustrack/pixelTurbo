import { Pool, QueryResult } from "pg";
import { FacebookPixel } from "../types";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class FacebookPixelModel {
  async create(facebookPixel: FacebookPixel): Promise<FacebookPixel> {
    const { domain_id, pixel_id, api_token, test_tag, test_tag_active } =
      facebookPixel;
    const id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();

    const query = `
      INSERT INTO facebook_pixels (id, domain_id, pixel_id, api_token, test_tag, test_tag_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      id,
      domain_id,
      pixel_id,
      api_token,
      test_tag,
      test_tag_active,
      created_at,
      updated_at,
    ];

    try {
      const result: QueryResult<FacebookPixel> = await pool.query(
        query,
        values
      );
      return result.rows[0];
    } catch (error: any) {
      console.error("Erro ao criar Facebook Pixel:", error);
      throw new Error("Erro ao criar Facebook Pixel.");
    }
  }

  async getAll(): Promise<FacebookPixel[]> {
    const query = "SELECT * FROM facebook_pixels;";

    try {
      const result: QueryResult<FacebookPixel> = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar todos os Facebook Pixels:", error);
      throw new Error("Erro ao buscar todos os Facebook Pixels");
    }
  }

  async getById(id: string): Promise<FacebookPixel | null> {
    const query = `SELECT * FROM facebook_pixels WHERE id = $1`;

    try {
      const result: QueryResult<FacebookPixel> = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar Facebook Pixel por ID:", error);
      throw new Error("Erro ao buscar Facebook Pixel por ID");
    }
  }

  async getByDomainId(domainId: string): Promise<FacebookPixel[]> {
    const query = `SELECT * FROM facebook_pixels WHERE domain_id = $1`;

    try {
      const result: QueryResult<FacebookPixel> = await pool.query(query, [
        domainId,
      ]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar Facebook Pixels por ID do domínio:", error);
      throw new Error("Erro ao buscar Facebook Pixels por ID do domínio");
    }
  }

  async update(
    id: string,
    facebookPixel: FacebookPixel
  ): Promise<FacebookPixel | null> {
    const { domain_id, pixel_id, api_token, test_tag, test_tag_active } =
      facebookPixel;
    const updated_at = new Date();
    const query = `
      UPDATE facebook_pixels
      SET domain_id = $1, pixel_id = $2, api_token = $3, test_tag = $4, test_tag_active = $5, updated_at = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      domain_id,
      pixel_id,
      api_token,
      test_tag,
      test_tag_active,
      updated_at,
      id,
    ];

    try {
      const result: QueryResult<FacebookPixel> = await pool.query(
        query,
        values
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar Facebook Pixel:", error);
      throw new Error("Erro ao atualizar Facebook Pixel");
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM facebook_pixels WHERE id = $1;";

    try {
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar Facebook Pixel:", error);
      throw new Error("Erro ao deletar Facebook Pixel");
    }
  }
}

export default new FacebookPixelModel();
