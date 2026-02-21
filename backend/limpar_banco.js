const mysql = require('mysql2/promise');
require('dotenv').config();

async function limpar() {
    const conn = await mysql.createConnection({
        host: 'banco-gestao-gestaoemdanca.j.aivencloud.com',
        port: 13908,
        user: 'avnadmin',
        password: process.env.DB_PASS,
        database: 'defaultdb',
        ssl: { rejectUnauthorized: false }
    });

    console.log("🧹 Removendo tabelas duplicadas para evitar erro 500...");
    
    const tabelasParaRemover = [
        'Alunos', 'Escolas', 'Funcionarios', 'Matriculas', 
        'Mensalidades', 'Turmas', 'Users', 'Professors', 'Comissaos'
    ];

    for (let tabela of tabelasParaRemover) {
        try {
            await conn.query(`DROP TABLE IF EXISTS \`${tabela}\``);
            console.log(`✅ Tabela duplicada '${tabela}' removida.`);
        } catch (e) {
            console.log(`⚠️ Erro ao remover ${tabela}: ${e.message}`);
        }
    }

    await conn.end();
    console.log("\n✨ Banco limpo! Agora o sistema usará apenas as tabelas oficiais em minúsculo.");
}

limpar();