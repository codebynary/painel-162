import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function fixSchema() {
    console.log(`Connecting to ${process.env.DB_HOST} as ${process.env.DB_USER}...`);

    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_USERS, // should be 'pw' now
            waitForConnections: true,
            connectionLimit: 1
        });

        // Test connection
        await pool.query('SELECT 1');
        console.log('✅ Connected successfully!');

        // 1. Check if 'characters' table exists
        const [tables] = await pool.query('SHOW TABLES LIKE "characters"');
        if ((tables as any[]).length === 0) {
            console.log('⚠️ Table "characters" not found. Creating it...');

            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS \`characters\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`userid\` int(11) NOT NULL,
                  \`roleid\` int(11) NOT NULL,
                  \`name\` varchar(32) NOT NULL,
                  \`cls\` int(2) NOT NULL DEFAULT '0',
                  \`level\` int(3) NOT NULL DEFAULT '1',
                  \`gender\` int(1) NOT NULL DEFAULT '0',
                  \`reputation\` int(11) NOT NULL DEFAULT '0',
                  \`status\` int(1) NOT NULL DEFAULT '1',
                  PRIMARY KEY (\`id\`),
                  KEY \`userid\` (\`userid\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `;
            await pool.query(createTableSQL);
            console.log('✅ Table "characters" created.');
        } else {
            console.log('ℹ️ Table "characters" already exists.');
        }

        // 2. Check if we have a test character for User 1024
        const [chars] = await pool.query('SELECT id FROM characters WHERE userid = 1024');
        if ((chars as any[]).length === 0) {
            console.log('⚠️ No characters found for User 1024. Inserting test character...');

            // Insert dummy Admin char
            await pool.query(`
                INSERT INTO characters (userid, roleid, name, cls, level, gender, reputation, status)
                VALUES (1024, 102401, 'GM_Admin', 1, 105, 0, 200000, 1)
            `);
            console.log('✅ Test character "GM_Admin" inserted for User 1024.');
        } else {
            console.log('ℹ️ Characters already exist for User 1024.');
        }

        await pool.end();
        console.log('🎉 Fix completed. Restart backend to test!');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error('Verify your VPN/Network connection to 192.168.1.57');
    }
}

fixSchema();
