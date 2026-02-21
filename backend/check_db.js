const mysql = require('mysql2/promise');
require('dotenv').config();

async function verificarBanco() {
    console.log("🔍 Conectando ao banco para inspeção...");
    
    try {
        const connection = await mysql.createConnection({
            host: "banco-gestao-gestaoemdanca.j.aivencloud.com",
            port: 13908,
            user: "avnadmin",
            password: process.env.DB_PASS, // Ele vai pegar a senha do seu .env
            database: "defaultdb",
            ssl: { rejectUnauthorized: false }
        });

        // 1. Listar Tabelas
        const [tabelas] = await connection.query("SHOW TABLES");
        console.log("\n📋 TABELAS ENCONTRADAS:");
        console.table(tabelas.map(t => t[Object.keys(t)[0]]));

        // 2. Verificar estrutura da tabela Escolas
        console.log("\n📐 ESTRUTURA DA TABELA 'Escolas':");
        try {
            const [estrutura] = await connection.query("DESCRIBE Escolas");
            console.table(estrutura);
        } catch (e) {
            console.log("❌ Tabela 'Escolas' (plural) não encontrada.");
        }

        await connection.end();
        console.log("\n✅ Inspeção finalizada.");
    } catch (error) {
        console.error("❌ Erro ao conectar:", error.message);
    }
}

verificarBanco();
