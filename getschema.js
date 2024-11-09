const { Client } = require("pg");

// Configuração de conexão com o PostgreSQL
// Conexão com o PostgreSQL utilizando a DATABASE_URL da Railway
const client = new Client({
  connectionString:
    "postgresql://postgres:oESeLpJeyViJWLrQeeLyotMHZjRwCuFB@junction.proxy.rlwy.net:51573/railway",
  ssl: {
    rejectUnauthorized: false, // Necessário para Railway, pois exige SSL em muitas conexões externas
  },
});

const getSchema = async () => {
  try {
    await client.connect();
    console.log("Conectado ao banco de dados!");

    // Consulta ao information_schema para pegar as tabelas e colunas
    const res = await client.query(`
            SELECT 
                table_name,
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM 
                information_schema.columns
            WHERE 
                table_schema = 'public'
            ORDER BY 
                table_name, ordinal_position;
        `);

    console.log("Schema do banco de dados:");
    res.rows.forEach((row) => {
      console.log(`Tabela: ${row.table_name}`);
      console.log(`  Coluna: ${row.column_name}`);
      console.log(`  Tipo: ${row.data_type}`);
      console.log(`  Nulo: ${row.is_nullable}`);
      console.log(`  Valor Padrão: ${row.column_default}`);
      console.log("--------------------------------");
    });
  } catch (err) {
    console.error("Erro ao buscar o schema do banco de dados:", err);
  } finally {
    await client.end();
    console.log("Conexão encerrada.");
  }
};

getSchema();
