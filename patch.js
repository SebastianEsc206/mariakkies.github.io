const mysql = require('mysql2/promise');

async function patch() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'merakiies_db'
        });

        console.log('Connected to DB');

        // Check if column exists
        const [columns] = await db.query("SHOW COLUMNS FROM products LIKE 'sales_count'");
        if (columns.length === 0) {
            console.log('Adding sales_count column...');
            await db.query("ALTER TABLE products ADD COLUMN sales_count INT(11) DEFAULT 0");
            
            // Randomize sales_count
            const [products] = await db.query("SELECT id FROM products");
            for (let p of products) {
                const randomSales = Math.floor(Math.random() * 500);
                await db.query("UPDATE products SET sales_count = ? WHERE id = ?", [randomSales, p.id]);
            }
            
            // Also update created_at to be somewhat random for testing "Nuevos ingresos"
            console.log('Randomizing created_at for sorting tests...');
            for (let p of products) {
                const pastDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
                await db.query("UPDATE products SET created_at = ? WHERE id = ?", [pastDate, p.id]);
            }
            console.log('Patch complete.');
        } else {
            console.log('Column sales_count already exists.');
        }

        await db.end();
        process.exit(0);
    } catch (err) {
        console.error('Error patching:', err);
        process.exit(1);
    }
}

patch();
