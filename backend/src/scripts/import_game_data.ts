import fs from 'fs';
import readline from 'readline';
import mysql from 'mysql2/promise';

async function importData() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'pw_users',
        waitForConnections: true,
        connectionLimit: 10
    });

    const filePath = 'F:\\Games\\Perfect World 1.6.2\\Nova pasta\\RAE_Exported_Table.tab';
    const fileStream = fs.createReadStream(filePath, { encoding: 'latin1' }); // PW tabs usually encoded in Latin1/CP1252

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    console.log('Starting import...');
    let count = 0;

    for await (const line of rl) {
        if (!line.trim()) continue;
        const parts = line.split('\t');
        if (parts.length < 3) continue;

        const id = parseInt(parts[0]);
        const color = parts[1];
        const name = parts[2].replace(/[^\x20-\x7E\sÀ-ÿ]/g, ''); // Clean special control chars

        if (!isNaN(id)) {
            await pool.execute(
                'INSERT INTO pw_items_data (item_id, name_color, name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name_color = ?, name = ?',
                [id, color, name, color, name]
            );
            count++;
            if (count % 1000 === 0) console.log(`Imported ${count} items...`);
        }
    }

    console.log(`Success! ${count} items imported.`);
    await pool.end();
}

importData().catch(console.error);
